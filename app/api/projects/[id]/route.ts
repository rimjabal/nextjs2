import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Project = {
id: string;
name: string;
color: string;
};

type Database = {
projects: Project[];
};

const dbPath = path.join(process.cwd(), 'db.json');

async function readDatabase(): Promise<Database> {
const raw = await fs.readFile(dbPath, 'utf8');
return JSON.parse(raw) as Database;
}

async function writeDatabase(database: Database) {
await fs.writeFile(dbPath, `${JSON.stringify(database, null, 2)}\n`, 'utf8');
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const database = await readDatabase();
const project = database.projects.find((item) => item.id === id);

if (!project) {
return NextResponse.json({ error: 'Project not found' }, { status: 404 });
}

return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const body = (await request.json()) as Partial<Project>;

if (!body.name || !body.color) {
return NextResponse.json({ error: 'name and color are required' }, { status: 400 });
}

const database = await readDatabase();
const projectIndex = database.projects.findIndex((item) => item.id === id);

if (projectIndex === -1) {
return NextResponse.json({ error: 'Project not found' }, { status: 404 });
}

database.projects[projectIndex] = {
...database.projects[projectIndex],
name: body.name,
color: body.color,
};

await writeDatabase(database);

return NextResponse.json(database.projects[projectIndex]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const database = await readDatabase();
const nextProjects = database.projects.filter((item) => item.id !== id);

if (nextProjects.length === database.projects.length) {
return NextResponse.json({ error: 'Project not found' }, { status: 404 });
}

database.projects = nextProjects;
await writeDatabase(database);

return NextResponse.json({ ok: true });
}