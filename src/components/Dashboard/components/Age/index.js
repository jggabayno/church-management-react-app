import React, { memo } from 'react'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Empty } from "antd";

export default memo(function Age({ data }) {
    return (
        <div className='age'>
            <h4>Members Age Bracket</h4>
            <div style={{ width: '100%', height: '95%' }}>
                {!data?.length && <Empty className='dashboard-partof-empty' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                <ResponsiveContainer >
                    <PieChart>
                        
                       <Pie
                            stroke='none'
                            dataKey='value'
                            isAnimationActive={false}
                            data={data}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data?.map((row, index) => (<Cell key={`cell-${index}`} fill={row.color} />))}
                        </Pie>
                      
                        <Legend verticalAlign="bottom" />

                    </PieChart>


                </ResponsiveContainer>
            </div>

        </div >
    )
})
