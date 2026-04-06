import { useState, useEffect, useRef } from 'react';

const useChat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm EduDisha AI, your personal career mentor. I see you excel at pattern recognition and logic." },
        { role: 'user', content: "I really enjoy mathematics and solving complex puzzles!" },
        { role: 'assistant', content: "That's fantastic! Have you considered a career in Robotics Engineering? Your aptitude in mathematics perfectly aligns with that path.", showButtons: true }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsThinking(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] })
            });

            const data = await response.json();
            if (data.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my neural core right now. Please try again in a moment!" }]);
        } finally {
            setIsThinking(false);
        }
    };

    return {
        messages,
        isThinking,
        inputValue,
        setInputValue,
        handleSendMessage,
        chatEndRef
    };
};

export default useChat;
