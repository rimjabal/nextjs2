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

const dbPath = path.join(process.cwd(), '..', 'db.json');

async function readDatabase(): Promise<Database> {
const raw = await fs.readFile(dbPath, 'utf8');
return JSON.parse(raw) as Database;
}

async function writeDatabase(database: Database) {
await fs.writeFile(dbPath, `${JSON.stringify(database, null, 2)}\n`, 'utf8');
}

function createProjectId() {
return Math.random().toString(36).slice(2, 12);
}

export async function GET() {
const database = await readDatabase();
return NextResponse.json(database.projects);
}

export async function POST(request: Request) {
const body = (await request.json()) as Partial<Project>;

if (!body.name || !body.color) {
return NextResponse.json({ error: 'name and color are required' }, { status: 400 });
}

const database = await readDatabase();
const project: Project = {
id: createProjectId(),
name: body.name,
color: body.color,
};

database.projects.push(project);
await writeDatabase(database);

return NextResponse.json(project, { status: 201 });
}