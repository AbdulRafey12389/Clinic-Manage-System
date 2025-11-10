import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const VisitsChart = ({ data }) => {
  if (!data) {
    return (
      <div className='bg-[#101614] rounded-2xl p-4 border border-[var(--border)] text-gray-400'>
        No chart data available
      </div>
    );
  }

  // ✅ Convert backend object to array format Recharts expects
  const chartArray = [
    { name: 'pending', value: data.pending || 0 },
    { name: 'Confirmed', value: data.confirmed || 0 },
    { name: 'Completed', value: data.completed || 0 },
    { name: 'Cancelled', value: data.cancelled || 0 },
  ];

  return (
    <div className='bg-[#101614] rounded-2xl p-4 border border-[var(--border)]'>
      <h3 className='font-semibold mb-3 text-white'>
        Appointments Overview (Status Wise)
      </h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartArray}
            barSize={35}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(255,255,255,0.05)'
            />
            <XAxis
              dataKey='name'
              stroke='rgba(255,255,255,0.6)'
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              stroke='rgba(255,255,255,0.6)'
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{
                background: '#071218',
                border: '1px solid rgba(255,255,255,0.04)',
                color: '#e6eef0',
              }}
            />
            <Bar
              dataKey='value'
              radius={[8, 8, 0, 0]}
              fill='url(#grad1)'
            />
            <defs>
              <linearGradient
                id='grad1'
                x1='0'
                x2='1'
                y1='0'
                y2='1'
              >
                <stop
                  offset='0%'
                  stopColor='#06b6a4'
                  stopOpacity={1}
                />
                <stop
                  offset='100%'
                  stopColor='#10b981'
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitsChart;
