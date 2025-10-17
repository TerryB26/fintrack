import React, { useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Sector, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{ fontSize: '14px', fontWeight: 'bold' }}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{ fontWeight: 'bold' }}>
        {`${value.toFixed(2)}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Piechart = ({ data, selectedAccount, currency }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (!selectedAccount || selectedAccount === 'ALL') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: 400,
          gap: 2
        }}
      >
        <Box
          component="img"
          src="/finance-animate.svg"
          alt="Select Account"
          sx={{
            width: 120,
            height: 120,
            opacity: 0.6,
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#64748B',
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          Select an account to view spending breakdown
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#94A3B8',
            textAlign: 'center',
          }}
        >
          Choose EUR or USD account from the menu
        </Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: 400,
          gap: 2
        }}
      >
        <Box
          sx={{
            fontSize: 60,
            opacity: 0.3
          }}
        >
          📊
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#64748B',
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          No spending data available
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#94A3B8',
            textAlign: 'center',
          }}
        >
          Start making transactions to see your spending breakdown
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart width={100} height={450}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Piechart;