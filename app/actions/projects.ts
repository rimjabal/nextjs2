'use server';
import { revalidatePath } from 'next/cache';
const rawBaseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
? normalizedBaseUrl.slice(0, -4)
: normalizedBaseUrl;
export async function addProject(formData: FormData) {
const name = formData.get('name') as string;
const color = formData.get('color') as string;
await fetch(`${apiBaseUrl}/api/projects`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, color }),
});
revalidatePath('/dashboard');
}

export async function renameProject(formData: FormData) {
const id = formData.get('id') as string;
const newName = formData.get('newName') as string;

const currentProjectResponse = await fetch(`${apiBaseUrl}/api/projects/${id}`, {
cache: 'no-store',
});
if (!currentProjectResponse.ok) {
return;
}
const currentProject = await currentProjectResponse.json();

await fetch(`${apiBaseUrl}/api/projects/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name: newName, color: currentProject.color }),
});

revalidatePath('/dashboard');
}

export async function deleteProject(formData: FormData) {
const id = formData.get('id') as string;

await fetch(`${apiBaseUrl}/api/projects/${id}`, {
method: 'DELETE',
});

revalidatePath('/dashboard');
}