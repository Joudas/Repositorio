from pydantic import BaseModel, Field
from datetime import datetime


class ProjectCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None


class TicketCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1)
    state: str = Field(default="pending")
    priority: str = Field(default="low")


class TicketUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    state: str | None = None
    priority: str | None = None


class TicketStateUpdateRequest(BaseModel):
    state: str = Field(min_length=1)


class TicketResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: str
    state: str
    priority: str


class ProjectListResponse(BaseModel):
    id: int
    name: str
    description: str | None
    tickets_count: int


class TicketStatsResponse(BaseModel):
    total_tickets: int
    pending: int
    in_progress: int
    completed: int


class ProjectDetailResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: str | None
    tickets: list[TicketResponse]


class NoteCreateRequest(BaseModel):
    note: str = Field(min_length=1)


class NoteResponse(BaseModel):
    id: int
    ticket_id: int
    note: str
    created_at: datetime
    updated_at: datetime


class OverviewStatsResponse(BaseModel):
    total_tickets: int
    high_priority: int


class CompletedStatsResponse(BaseModel):
    total_tickets: int
    high_priority: int


class InProgressStatsResponse(BaseModel):
    total_tickets: int
    high_priority: int


class PendingStatsResponse(BaseModel):
    total_tickets: int
    high_priority: int


class ProjectStateCount(BaseModel):
    project_id: int
    project_name: str
    count: int
    high_priority: int


class ByProjectCount(BaseModel):
    project_id: int
    project_name: str
    total_tickets: int


class ProjectHighPriorityTickets(BaseModel):
    project_id: int
    project_name: str
    tickets: list[TicketResponse]


class ProjectProgress(BaseModel):
    project_id: int
    project_name: str
    completed: int
    remaining: int
    progress_percent: float


class HighPriorityPendingResponse(BaseModel):
    high_priority_total: int
    high_priority_pending: int