import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Job = {
  id: number;
  name: string;
  plugin: string;
  target: string;
  depth: number;
  status: string;
  created_at: string;
};

export default async function JobsPage() {
  const jobs = await apiFetch<Job[]>("/jobs");

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Jobs</h1>
          <p className="mt-2 text-slate-400">Queued scrape jobs and recent activity.</p>
        </div>
        <Link href="/jobs/new" className="rounded-2xl border border-line px-4 py-2 text-sm hover:bg-white/5">
          New Job
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Plugin</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-line/70">
                <td className="px-4 py-3">
                  <Link href={`/jobs/${job.id}`} className="hover:underline">
                    {job.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-300">{job.plugin}</td>
                <td className="px-4 py-3">{job.status}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(job.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
