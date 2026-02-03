import React, { useState } from 'react';
import { Button } from './ui/button';
import { generateAIAnswer } from '../services/aiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const AIAnswer = ({ questionTitle }) => {
    const [language, setLanguage] = useState("English");
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await generateAIAnswer(questionTitle, language);
            setAnswer(result);
        } catch (e) {
            setAnswer("Failed to generate answer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-6 border-dashed border-2">
            <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <span>✨ Ask AI Helper</span>
                    <input
                        className="text-xs border rounded px-2 py-1 font-normal w-32"
                        placeholder="Language (e.g. Spanish)"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                    <Button size="sm" variant="outline" onClick={handleGenerate} disabled={loading}>
                        {loading ? "Generating..." : "Generate Answer"}
                    </Button>
                </CardTitle>
            </CardHeader>
            {answer && (
                <CardContent className="text-sm bg-muted/20 p-4 rounded-b-lg whitespace-pre-wrap">
                    {answer}
                </CardContent>
            )}
        </Card>
    );
};

export default AIAnswer;
