"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAiModel";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

  const router = useRouter();

  const { user } = useUser();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const inputPrompt = `Job Role: ${jobPosition}\nJob Description: ${jobDesc}\nYears of Experience: ${jobExperience}\n\nBased on these details, give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with their answers in json format. Give question and answer as fields in the json.`;

    const result = await chatSession.sendMessage(inputPrompt);
    const mockResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    setJsonResponse(mockResponse);
    if (mockResponse) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          jsonMockResp: mockResponse,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("inserted ID: ", resp);
      if (resp) {
        setJobPosition("");
        setJobDesc("");
        setJobExperience("");
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`)
      }
    } else {
      console.log("Error");
    }

    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <h2 className="font-bold text-2xl">
                Tell us more about the job you are interviewing
              </h2>
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h3>
                    Add details about your job position/role, job description
                    and years of experience.
                  </h3>
                  <div className="mt-7 my-3">
                    <label htmlFor="">Job Role/Position</label>
                    <Input
                      placeholder="Eg. Full Stack Developer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label htmlFor="">
                      Job Description/Tech Stack (in short)
                    </label>
                    <Textarea
                      placeholder="Eg. Node.js, Express.js, MongoDB, React.js"
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label htmlFor="">Years of Experience</label>
                    <Input
                      placeholder="Eg. 2"
                      type="number"
                      max="50"
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating questions
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
