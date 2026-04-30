import NextLink from '@/components/NextLink';
import { getServerSession } from './actions/authActions';

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <div className="h-full">
      <section className="h-screen flex items-center justify-center text-center px-6 bg-linear-to-b from-teal-50 to-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Simplify <span className="text-teal-600">Maintenance</span>{' '}
            Management
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            FixFlow helps companies manage equipment failures and service
            requests across multiple locations. Employees can quickly report
            issues while service teams track and resolve them from a centralized
            dashboard.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <div className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
              <NextLink href={user ? `/workspace` : '/login'}>
                {user ? 'Workspace' : 'Login'}
              </NextLink>
            </div>
            <a
              href="#features"
              className="px-6 py-3 border border-teal-600 text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center">
            Powerful Maintenance Management
          </h2>

          <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
            FixFlow provides everything you need to manage service requests and
            equipment issues across all your locations.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-linear-to-b from-teal-50 to-white rounded-xl border-2 border-teal-700">
              <h3 className="font-semibold text-lg">Issue Reporting</h3>
              <p className="text-gray-600 mt-2">
                Employees can quickly report equipment failures with a clear
                description and location.
              </p>
            </div>

            <div className="p-6 bg-linear-to-b from-teal-50 to-white rounded-xl border-2 border-teal-700">
              <h3 className="font-semibold text-lg">Service Tracking</h3>
              <p className="text-gray-600 mt-2">
                Service teams receive and manage repair requests from a
                centralized dashboard.
              </p>
            </div>

            <div className="p-6 bg-linear-to-b from-teal-50 to-white rounded-xl border-2 border-teal-700">
              <h3 className="font-semibold text-lg">Centralized Dashboard</h3>
              <p className="text-gray-600 mt-2">
                Manage all maintenance activities from one simple and organized
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-linear-to-b from-teal-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center">How FixFlow Works</h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-300">1</div>
              <h3 className="font-semibold mt-4">Report an Issue</h3>
              <p className="text-gray-600 mt-2">
                Employees submit a service request describing the problem.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-300">2</div>
              <h3 className="font-semibold mt-4">Service Review</h3>
              <p className="text-gray-600 mt-2">
                Clients submit tickets and technicians manage and resolve them
                through a shared workspace.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-300">3</div>
              <h3 className="font-semibold mt-4">Resolve the Problem</h3>
              <p className="text-gray-600 mt-2">
                The technician fixes the issue and updates the request status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASE */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Built for Multi-Location Companies
          </h2>

          <p className="text-gray-600 mt-6">
            Imagine a supermarket chain with dozens of locations. If a freezer
            stops working in one store, employees can immediately report the
            issue through FixFlow. The service team receives the request, sends
            a technician, and tracks the repair process — all in one system.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-teal-700 py-8 px-6 bg-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-700">
          <p>© {new Date().getFullYear()} FixFlow</p>
          <p>
            Designed and developed by{' '}
            <span className="font-semibold text-teal-800">
              Aleksa Dmitrovic
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
