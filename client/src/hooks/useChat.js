import { useState, useEffect, useRef } from 'react';

const useChat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm EduDisha AI, your personal career mentor. I see you excel at pattern recognition and logic." },
        { role: 'user', content: "I really enjoy mathematics and solving complex puzzles!" },
        { role: 'assistant', content: "That's fantastic! Have you considered a career in Robotics Engineering? Your aptitude in mathematics perfectly aligns with that path.", showButtons: true }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if ((!inputValue.trim() && !selectedFile) || isThinking) return;

        const userMessage = { role: 'user', content: inputValue || (selectedFile ? `Uploaded: ${selectedFile.name}` : "") };
        setMessages(prev => [...prev, userMessage]);
        
        const currentFile = selectedFile;
        setInputValue('');
        setSelectedFile(null);
        setIsThinking(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('messages', JSON.stringify([...messages, userMessage]));
            if (currentFile) {
                formData.append('file', currentFile);
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: formData
            });

            const data = await response.json();
            if (data.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble analyzing your request right now. Please try again in a moment!" }]);
        } finally {
            setIsThinking(false);
        }
    };

    return {
        messages,
        isThinking,
        inputValue,
        setInputValue,
        selectedFile,
        setSelectedFile,
        handleSendMessage,
        chatEndRef
    };
};

export default useChat;
