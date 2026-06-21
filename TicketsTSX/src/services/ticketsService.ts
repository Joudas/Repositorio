import { request } from './httpClient';

export function createProject(payload) {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
export function getProject(id) {
  return request('/projects/' + id, {
    method: 'GET',
  });
}
export function getProjects() {
  return request('/projects', {
    method: 'GET'
  });
}

export function getTicketStats() {
  return request('/projects/stats', {
    method: 'GET',
  });
}

//Tickets
export function createTicket(payload, projectID) {
  return request(`/projects/${projectID}/tickets`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
export function getTicketProject(projectID) {
  return request(`/projects/${projectID}`, {
    method: 'GET',
  });
}
export function changeStateTicket(state: string, ticketID: string) {
  return request(`/projects/tickets/${ticketID}/state`, {
    method: 'PATCH',
    body: JSON.stringify({ state }),
  });
}
export function updateTicket(payload, ticketID) {
  return request(`/projects/tickets/${ticketID}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
export function deleteTicket(ticketID) {
  return request(`/projects/tickets/${ticketID}`, {
    method: 'DELETE',
  });
}
//notas
export function createNote(payload, projectID, ticketID) {
  return request(`/projects/${projectID}/tickets/${ticketID}/notes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
export function getNotes(projectID, ticketID) {
  return request(`/projects/${projectID}/tickets/${ticketID}/notes`, {
    method: 'GET',
  });
}

export function overview() {
  // "total_tickets": 42,
  // "high_priority": 10
  return request(`/projects/stats/overview`, {
    method: 'GET',
  });
}
export function ticketsInProgress() {
  // "total_in_progress": 5,
  // "high_priority_in_progress": 2
  return request(`/projects/stats/in-progress`, {
    method: 'GET',
  });
}
export function ticketsCompleted() {
  // "total_completed": 18,
  // "high_priority_completed": 5
  return request(`/projects/stats/completed`, {
    method: 'GET',
  });
}
export function ticketsPending() {
  return request(`/projects/stats/pending`, {
    method: 'GET',
  });
}
export function highPriority() {
  // "high_priority_total": 10,
  // "high_priority_pending": 4
  return request(`/projects/stats/high-priority/pending`, {
    method: 'GET',
  });
}
export function ticketsByProyect() {
  //   "project_id": 1,
  //   "project_name": "Proyecto A",
  //   "total_tickets": 15
  return request(`/projects/stats/by-project`, {
    method: 'GET',
  });
}
export function ticketsHighByProyect() {
  //   "project_id": 1,
  //   "project_name": "Proyecto A",
  //   "tickets": [
  //     {
  //       "id": 101,
  //       "project_id": 1,
  //       "name": "Incidente crítico",
  //       "description": "Detalle...",
  //       "state": "pending",
  //       "priority": "high"
  //     }
  //   ]
  return request(`/projects/stats/high-priority-tickets`, {
    method: 'GET',
  });
}
export function ticketsProgress() {
  //   "project_id": 1,
  //   "project_name": "Proyecto A",
  //   "completed": 8,
  //   "remaining": 4,
  //   "progress_percent": 66.67
  return request(`/projects/stats/progress`, {
    method: 'GET',
  });
}
