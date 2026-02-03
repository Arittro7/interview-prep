import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';       
import { Textarea } from './ui/textarea';   
import { supabase } from '../lib/supabase';

const AddQuestion = () => {
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !answer.trim()) {
      setMessage('Title and Answer are required!');
      return;
    }

    setLoading(true);
    setMessage('');

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const { error } = await supabase
      .from('questions')
      .insert([{ title, answer, tags: tagsArray }]);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage('Error: ' + (error.message || 'Failed to add question'));
    } else {
      setMessage('Question added successfully!');
      setTitle('');
      setAnswer('');
      setTags('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Add New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            placeholder="e.g. What is useEffect in React?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Answer</label>
          <Textarea
            placeholder="Write the full explanation here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma-separated)
          </label>
          <Input
            placeholder="e.g. React, Hooks, Frontend"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Adding...' : 'Add Question'}
        </Button>

        {message && (
          <p className={`text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddQuestion;