import AddProjectForm from './AddProjectForm';
import { deleteProject, renameProject } from '../actions/projects';
const rawBaseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
? normalizedBaseUrl.slice(0, -4)
: normalizedBaseUrl;
export default async function DashboardPage() {
const res = await fetch(`${apiBaseUrl}/api/projects`, { cache: 'no-store' });
const data = res.ok ? await res.json() : [];
const projects = Array.isArray(data) ? data : [];
return (
<div style={{ padding: '2rem' }}>
<h1>Dashboard</h1>
<AddProjectForm />
<ul>
{projects.map((p: any) => (
<li key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
<span style={{ width: 12, height: 12, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
<a href={`/projects/${p.id}`}>{p.name}</a>
<form action={renameProject} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
<input type="hidden" name="id" value={p.id} />
<input type="text" name="newName" defaultValue={p.name} />
<button type="submit">Renommer</button>
</form>
<form action={deleteProject} style={{ display: 'inline' }}>
<input type="hidden" name="id" value={p.id} />
<button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
🗑️
</button>
</form>
</li>
))}
</ul>
</div>
);
}