import React from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { cn } from "../lib/utils";

const Home = () => {
  const { allTags, selectedTags, setSelectedTags, startInterview } =
    useInterview();
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="container max-w-3xl mx-auto flex flex-col items-center min-h-[80vh] p-6">
      <div className="w-full flex justify-between mb-6">
        <Button variant="outline" onClick={() => navigate("/questions")}>
          View All Questions
        </Button>
        <Button variant="outline" onClick={() => navigate("/add-question")}>
          + Add New Question
        </Button>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Interview Preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Select Topics (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Choose tags to focus on specific topics, or leave empty for
              completely random questions.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {allTags.map((tag) => (
                <div
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors border select-none",
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted text-foreground border-border",
                  )}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <Button
            size="lg"
            onClick={() => {
              startInterview(selectedTags);
              navigate("/interview"); // ← add this line
            }}
            className="w-full sm:w-auto px-10 py-6 text-lg"
          >
            Start Interview
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
