'use client';

import { signOut } from 'next-auth/react';
import { User } from 'next-auth';

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">
              DevStay Admin
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || 'Admin'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user.name || 'Admin'}
                </p>
                <p className="text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 