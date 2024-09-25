'use client'
import React, {useState, useEffect} from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Questions from './_components/Questions'
import RecordAnsSection from './_components/RecordAnsSection'

const StartInterview = ({params}) => {
    const [interviewData, setInterviewData] = useState()
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState()
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

    useEffect(() => {
        getInterviewDetails()
    }, [])

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        setMockInterviewQuestions(jsonMockResp)
        setInterviewData(result[0])
        console.log(jsonMockResp)
    }
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* Questions */}
            <Questions mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex}/>
            <RecordAnsSection />
            {/* Video */}

        </div>
    </div>
  )
}

export default StartInterview