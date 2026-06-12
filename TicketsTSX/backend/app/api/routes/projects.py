from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session, joinedload

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.project import Project
from app.models.ticket import Ticket
from app.models.note import Note
from app.models.user import User
from app.schemas.project import (
    ProjectCreateRequest,
    ProjectDetailResponse,
    ProjectListResponse,
    TicketStatsResponse,
    OverviewStatsResponse,
    CompletedStatsResponse,
    InProgressStatsResponse,
    PendingStatsResponse,
    ProjectStateCount,
    ByProjectCount,
    ProjectHighPriorityTickets,
    ProjectProgress,
    HighPriorityPendingResponse,
    TicketCreateRequest,
    TicketResponse,
    TicketStateUpdateRequest,
    TicketUpdateRequest,
    NoteCreateRequest,
    NoteResponse,
)

router = APIRouter(prefix="/projects", tags=["projects"])

ALLOWED_TICKET_STATES = {"pending", "in_progress", "completed"}
ALLOWED_TICKET_PRIORITIES = {"low", "medium", "high"}
ALLOWED_TICKET_TRANSITIONS = {
    "pending": {"in_progress", "completed"},
    "in_progress": {"completed"},
    "completed": set(),
}


def _ticket_response(ticket: Ticket) -> TicketResponse:
    return TicketResponse(
        id=ticket.id,
        project_id=ticket.project_id,
        name=ticket.name,
        description=ticket.description,
        state=ticket.state,
        priority=ticket.priority,
    )



@router.get("/stats/overview", response_model=OverviewStatsResponse)
def stats_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stats = (
        db.query(
            func.count(Ticket.id).label("total_tickets"),
            func.coalesce(func.sum(case((Ticket.priority == "high", 1), else_=0)), 0).label("high_priority"),
        )
        .join(Project)
        .filter(Project.user_id == current_user.id)
        .one()
    )
    return OverviewStatsResponse(total_tickets=int(stats.total_tickets or 0), high_priority=int(stats.high_priority or 0))


@router.get("/stats/completed", response_model=CompletedStatsResponse)
def stats_completed(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stats = (
        db.query(
            func.coalesce(func.sum(case((Ticket.state == "completed", 1), else_=0)), 0).label("total_completed"),
            func.coalesce(func.sum(case(((Ticket.state == "completed") & (Ticket.priority == "high"), 1), else_=0)), 0).label("high_priority_completed"),
        )
        .join(Project)
        .filter(Project.user_id == current_user.id)
        .one()
    )
    return CompletedStatsResponse(total_tickets=int(stats.total_completed or 0), high_priority=int(stats.high_priority_completed or 0))


@router.get("/stats/in-progress", response_model=InProgressStatsResponse)
def stats_in_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stats = (
        db.query(
            func.coalesce(func.sum(case((Ticket.state == "in_progress", 1), else_=0)), 0).label("total_in_progress"),
            func.coalesce(func.sum(case(((Ticket.state == "in_progress") & (Ticket.priority == "high"), 1), else_=0)), 0).label("high_priority_in_progress"),
        )
        .join(Project)
        .filter(Project.user_id == current_user.id)
        .one()
    )
    return InProgressStatsResponse(total_tickets=int(stats.total_in_progress or 0), high_priority=int(stats.high_priority_in_progress or 0))


@router.get("/stats/pending", response_model=PendingStatsResponse)
def stats_pending(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stats = (
        db.query(
            func.coalesce(func.sum(case((Ticket.state == "pending", 1), else_=0)), 0).label("total_pending"),
            func.coalesce(func.sum(case(((Ticket.state == "pending") & (Ticket.priority == "high"), 1), else_=0)), 0).label("high_priority_pending"),
        )
        .join(Project)
        .filter(Project.user_id == current_user.id)
        .one()
    )
    return PendingStatsResponse(total_tickets=int(stats.total_pending or 0), high_priority=int(stats.high_priority_pending or 0))


@router.get("/stats/high-priority/pending", response_model=HighPriorityPendingResponse)
def stats_high_priority_pending(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stats = (
        db.query(
            func.coalesce(func.sum(case((Ticket.priority == "high", 1), else_=0)), 0).label("high_priority_total"),
            func.coalesce(func.sum(case(((Ticket.priority == "high") & (Ticket.state == "pending"), 1), else_=0)), 0).label("high_priority_pending"),
        )
        .join(Project)
        .filter(Project.user_id == current_user.id)
        .one()
    )
    return HighPriorityPendingResponse(high_priority_total=int(stats.high_priority_total or 0), high_priority_pending=int(stats.high_priority_pending or 0))


@router.get("/stats/by-project", response_model=list[ByProjectCount])
def stats_by_project(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = (
        db.query(
            Project.id.label("project_id"),
            Project.name.label("project_name"),
            func.coalesce(func.count(Ticket.id), 0).label("total_tickets"),
        )
        .join(Ticket, Ticket.project_id == Project.id)
        .filter(Project.user_id == current_user.id)
        .group_by(Project.id)
        .all()
    )
    return [ByProjectCount(project_id=r.project_id, project_name=r.project_name, total_tickets=int(r.total_tickets)) for r in q]


@router.get("/stats/high-priority-tickets", response_model=list[ProjectHighPriorityTickets])
def stats_high_priority_tickets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = (
        db.query(Ticket, Project)
        .join(Project, Ticket.project_id == Project.id)
        .filter(Project.user_id == current_user.id, Ticket.priority == "high")
        .order_by(Project.id)
        .all()
    )
    grouped: dict[int, dict] = {}
    for ticket, project in rows:
        pid = project.id
        if pid not in grouped:
            grouped[pid] = {"project_id": pid, "project_name": project.name, "tickets": []}
        grouped[pid]["tickets"].append(_ticket_response(ticket))
    return [ProjectHighPriorityTickets(project_id=v["project_id"], project_name=v["project_name"], tickets=v["tickets"]) for v in grouped.values()]


@router.get("/stats/progress", response_model=list[ProjectProgress])
def stats_progress_per_project(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = (
        db.query(
            Project.id.label("project_id"),
            Project.name.label("project_name"),
            func.coalesce(func.sum(case((Ticket.state == "completed", 1), else_=0)), 0).label("completed"),
            func.coalesce(func.sum(case(((Ticket.state == "pending") | (Ticket.state == "in_progress"), 1), else_=0)), 0).label("remaining"),
        )
        .join(Ticket, Ticket.project_id == Project.id)
        .filter(Project.user_id == current_user.id)
        .group_by(Project.id)
        .all()
    )
    result: list[ProjectProgress] = []
    for r in q:
        completed = int(r.completed)
        remaining = int(r.remaining)
        total = completed + remaining
        percent = round((completed / total) * 100, 2) if total > 0 else 0.0
        result.append(ProjectProgress(project_id=r.project_id, project_name=r.project_name, completed=completed, remaining=remaining, progress_percent=percent))
    return result



@router.post("", status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectDetailResponse:
    project = Project(
        user_id=current_user.id,
        name=payload.name,
        description=payload.description,
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    return ProjectDetailResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        description=project.description,
        tickets=[],
    )


@router.get("")
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ProjectListResponse]:
    projects = (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .options(joinedload(Project.tickets))
        .order_by(Project.id.desc())
        .all()
    )

    return [
        ProjectListResponse(
            id=project.id,
            name=project.name,
            description=project.description,
            tickets_count=len(project.tickets),
        )
        for project in projects
    ]


@router.get("/stats")
def get_ticket_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketStatsResponse:
    stats = (
        db.query(
            func.count(Ticket.id).label("total_tickets"),
            func.coalesce(func.sum(case((Ticket.state == "pending", 1), else_=0)), 0).label("pending"),
            func.coalesce(func.sum(case((Ticket.state == "in_progress", 1), else_=0)), 0).label("in_progress"),
            func.coalesce(func.sum(case((Ticket.state == "completed", 1), else_=0)), 0).label("completed"),
        )
        .join(Project)
        .filter(Project.user_id == current_user.id)
        .one()
    )

    return TicketStatsResponse(
        total_tickets=int(stats.total_tickets or 0),
        pending=int(stats.pending or 0),
        in_progress=int(stats.in_progress or 0),
        completed=int(stats.completed or 0),
    )


@router.get("/{project_id}")
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectDetailResponse:
    project = (
        db.query(Project)
        .options(joinedload(Project.tickets))
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    return ProjectDetailResponse(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        description=project.description,
        tickets=[_ticket_response(ticket) for ticket in project.tickets],
    )


@router.post("/{project_id}/tickets", status_code=status.HTTP_201_CREATED)
def create_ticket(
    project_id: int,
    payload: TicketCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketResponse:
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # validate state and priority
    if payload.state not in ALLOWED_TICKET_STATES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket state")
    if payload.priority not in ALLOWED_TICKET_PRIORITIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket priority")

    ticket = Ticket(
        project_id=project.id,
        name=payload.name,
        description=payload.description,
        state=payload.state,
        priority=payload.priority,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return _ticket_response(ticket)


@router.put("/tickets/{ticket_id}")
def update_ticket(
    ticket_id: int,
    payload: TicketUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketResponse:
    ticket = (
        db.query(Ticket)
        .join(Project)
        .filter(Ticket.id == ticket_id, Project.user_id == current_user.id)
        .first()
    )
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    if payload.state is not None:
        if payload.state not in ALLOWED_TICKET_STATES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket state")
        ticket.state = payload.state

    if payload.priority is not None:
        if payload.priority not in ALLOWED_TICKET_PRIORITIES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket priority")
        ticket.priority = payload.priority

    if payload.name is not None:
        ticket.name = payload.name

    if payload.description is not None:
        ticket.description = payload.description

    db.commit()
    db.refresh(ticket)
    return _ticket_response(ticket)


@router.delete("/tickets/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    ticket = (
        db.query(Ticket)
        .join(Project)
        .filter(Ticket.id == ticket_id, Project.user_id == current_user.id)
        .first()
    )
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    db.delete(ticket)
    db.commit()


@router.patch("/tickets/{ticket_id}/state")
def update_ticket_state(
    ticket_id: int,
    payload: TicketStateUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketResponse:
    ticket = (
        db.query(Ticket)
        .join(Project)
        .filter(Ticket.id == ticket_id, Project.user_id == current_user.id)
        .first()
    )
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    new_state = payload.state.strip().lower()
    current_state = (ticket.state or "").strip().lower()

    if new_state not in ALLOWED_TICKET_STATES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket state")

    # idempotent update
    if new_state == current_state:
        return _ticket_response(ticket)

    allowed_next_states = ALLOWED_TICKET_TRANSITIONS.get(current_state, set())
    if new_state not in allowed_next_states:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Invalid state transition: {current_state} -> {new_state}",
        )

    ticket.state = new_state
    db.commit()
    db.refresh(ticket)
    return _ticket_response(ticket)


@router.get("/{project_id}/tickets/{ticket_id}/notes")
def get_notes(
    project_id: int,
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[NoteResponse]:
    """Get all notes for a specific ticket"""
    # Verify project belongs to current user
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Verify ticket belongs to project
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.project_id == project_id).first()
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    notes = db.query(Note).filter(Note.ticket_id == ticket_id).order_by(Note.created_at.desc()).all()

    return [
        NoteResponse(
            id=note.id,
            ticket_id=note.ticket_id,
            note=note.note,
            created_at=note.created_at,
            updated_at=note.updated_at,
        )
        for note in notes
    ]


@router.post("/{project_id}/tickets/{ticket_id}/notes", status_code=status.HTTP_201_CREATED)
def create_note(
    project_id: int,
    ticket_id: int,
    payload: NoteCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NoteResponse:
    """Create a new note for a specific ticket"""
    # Verify project belongs to current user
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Verify ticket belongs to project
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.project_id == project_id).first()
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    note = Note(
        ticket_id=ticket_id,
        note=payload.note,
    )
    db.add(note)
    db.commit()
    db.refresh(note)

    return NoteResponse(
        id=note.id,
        ticket_id=note.ticket_id,
        note=note.note,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )