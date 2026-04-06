'use client';
import React, { useState } from 'react';

export default function TicketsTable() {
  const [date, setDate] = useState(new Date());

  return (
    <table className="w-full">
      <caption>Tickets</caption>
      <thead className="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Title
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Workspace
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Created By
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Assigned To
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Schedule At
          </th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">
            Completed At
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-3 text-sm text-gray-700">Issue with machine</td>
          <td>My Workspace</td>
          <td>Aman 167</td>
          <td>Tech 12</td>
          <td>{date.toLocaleDateString()}</td>
          <td>{date.toLocaleDateString()}</td>
        </tr>
      </tbody>
    </table>
  );
}
