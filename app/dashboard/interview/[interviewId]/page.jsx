'use client'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React, {useState, useEffect} from 'react'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Interview = ({params}) => {
    const [interviewData, setInterviewData] = useState()
    const [webcamEnabled, setWebcamEnabled] = useState(false)

    useEffect(()=> {
        console.log(params.interviewId)
        getInterviewDetails()
    }, [])

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
        setInterviewData(result[0])
    }
  return (
    <div className='my-10'> 
        <h2 className='font-bold text-2xl'>Let's Get Started!</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='flex flex-col my-5 gap-3 justify-center'>
            <div className='flex flex-col p-5 rounded-lg border'>
                <h3><span className='font-bold'>Job Role: </span>{interviewData?.jobPosition}</h3>
                <h3><span className='font-bold'>Job Description: </span>{interviewData?.jobDesc}</h3>
                <h3><span className='font-bold'>Years of Experience: </span>{interviewData?.jobExperience}</h3>
            </div>
            <div className='p-5 rounded-lg border border-yellow-300 bg-yellow-100'>
                <h3 className='flex gap-2 items-center text-yellow-800'><Lightbulb/><span className='font-bold'>Information</span></h3>
                <h3 className='mt-2 text-yellow-600'>Enable Webcam and microphone to start your AI Generated Mock Interview. It has 5 questions which you need to answer. Once done, you will get a report on your performance.</h3>
            </div>
            </div>
            <div>
                {webcamEnabled ? 
                <Webcam 
                    style={{height:500, width:500}}
                    onUserMedia={() => setWebcamEnabled(true)}    
                    onUserMediaError={() => setWebcamEnabled(false)}
                    mirrored={true}
                /> 
                :
                <>
                    <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
                    <Button variant="ghost" onClick={() => setWebcamEnabled(true)} className='w-full border'>Enable Webcam and Mic</Button>
                </>
                }
            </div>
        </div>
        <div className='flex justify-end items-end my-4'>
            <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <Button>Start Interview</Button>
            </Link>
        </div>
    </div>
  )
}

export default Interview