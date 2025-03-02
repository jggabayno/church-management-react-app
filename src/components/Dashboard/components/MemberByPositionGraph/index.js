import React, { memo } from 'react'
import { Radio, Empty } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
export default memo(function MemberByPosition({ data}) {

    return (
        <div className='member-positions'>
            <h4>Member Positions</h4>
        
            <div className='wrapped-chart' style={{ width: '100%', height: '80%' }}>
                {!data?.length ? <Empty className='dashboard-partof-empty' image={Empty.PRESENTED_IMAGE_SIMPLE} />

                    : <>
                        <span style={{ visibility: 'hidden' }}>.</span>
                        <ResponsiveContainer>
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,

                                    // right: -70,
                                    // left: -110,
                                    bottom: 40
                                }}
                            >
                                <CartesianGrid stroke='#f2f2f2'
                                    vertical={false}
                                    axisLine={false} />
                                <XAxis
                                    // tick={{ angle: -451 }}
                                    textAnchor='end'
                                    axisLine={false}
                                    tickLine={false}
                                    interval={0}
                                    dataKey="name"
                                    dx={20}
                                    dy={20}
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Bar dataKey="count" fill="#5db7f6" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </>

                }

            </div>
        </div>
    )
})
