
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Skill, PortfolioItem, TopEdit, Message } from '../../types';

type Tab = 'skills' | 'portfolio' | 'top-edits' | 'messages';

const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('messages');
    
    // Data states
    const [skills, setSkills] = useState<Skill[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [topEdits, setTopEdits] = useState<TopEdit[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    // Form states
    const [newSkill, setNewSkill] = useState({ name: '', img_url: '' });
    const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', img_url: '', project_url: '' });
    const [newTopEdit, setNewTopEdit] = useState({ title: '', description: '', img_url: '' });

    const fetchData = async () => {
        const { data: skillsData } = await supabase.from('skills').select('*').order('id');
        setSkills(skillsData || []);
        const { data: portfolioData } = await supabase.from('portfolio_items').select('*').order('id');
        setPortfolioItems(portfolioData || []);
        const { data: editsData } = await supabase.from('top_edits').select('*').order('id');
        setTopEdits(editsData || []);
        const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        setMessages(messagesData || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (table: string, id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) alert('Error deleting item: ' + error.message);
            else fetchData();
        }
    };

    const handleAdd = async (table: string, data: any) => {
        const { error } = await supabase.from(table).insert([data]);
        if (error) alert('Error adding item: ' + error.message);
        else {
            fetchData();
            // Reset forms
            setNewSkill({ name: '', img_url: '' });
            setNewPortfolio({ title: '', description: '', img_url: '', project_url: '' });
            setNewTopEdit({ title: '', description: '', img_url: '' });
        }
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'messages':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Inbox</h2>
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className="p-4 border rounded bg-gray-50">
                                    <p className="font-bold">{msg.name} <span className="font-normal text-gray-500">&lt;{msg.email}&gt;</span></p>
                                    <p className="text-sm text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                                    <p className="mt-2">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'skills':
                return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Manage Skills</h2>
                        <div className="space-y-2 mb-6">
                            {skills.map(s => (<div key={s.id} className="flex items-center justify-between p-2 border rounded"><span>{s.name}</span><button onClick={() => handleDelete('skills', s.id)} className="text-red-500">Delete</button></div>))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAdd('skills', newSkill); }} className="p-4 border rounded bg-gray-50 space-y-3">
                            <h3 className="font-bold">Add New Skill</h3>
                            <input value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} placeholder="Skill Name" className="w-full p-2 border rounded" required />
                            <input value={newSkill.img_url} onChange={e => setNewSkill({...newSkill, img_url: e.target.value})} placeholder="Image URL" className="w-full p-2 border rounded" required />
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded">Add Skill</button>
                        </form>
                    </div>
                );
             case 'portfolio':
                return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Manage Portfolio</h2>
                         <div className="space-y-2 mb-6">
                            {portfolioItems.map(p => (<div key={p.id} className="flex items-center justify-between p-2 border rounded"><span>{p.title}</span><button onClick={() => handleDelete('portfolio_items', p.id)} className="text-red-500">Delete</button></div>))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAdd('portfolio_items', newPortfolio); }} className="p-4 border rounded bg-gray-50 space-y-3">
                            <h3 className="font-bold">Add New Portfolio Item</h3>
                            <input value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} placeholder="Title" className="w-full p-2 border rounded" required/>
                            <input value={newPortfolio.description} onChange={e => setNewPortfolio({...newPortfolio, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded" required/>
                            <input value={newPortfolio.img_url} onChange={e => setNewPortfolio({...newPortfolio, img_url: e.target.value})} placeholder="Image URL" className="w-full p-2 border rounded" required/>
                            <input value={newPortfolio.project_url} onChange={e => setNewPortfolio({...newPortfolio, project_url: e.target.value})} placeholder="Project URL" className="w-full p-2 border rounded" />
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded">Add Item</button>
                        </form>
                    </div>
                );
            case 'top-edits':
                 return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Manage Top Edits</h2>
                         <div className="space-y-2 mb-6">
                            {topEdits.map(e => (<div key={e.id} className="flex items-center justify-between p-2 border rounded"><span>{e.title}</span><button onClick={() => handleDelete('top_edits', e.id)} className="text-red-500">Delete</button></div>))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAdd('top_edits', newTopEdit); }} className="p-4 border rounded bg-gray-50 space-y-3">
                            <h3 className="font-bold">Add New Top Edit</h3>
                            <input value={newTopEdit.title} onChange={e => setNewTopEdit({...newTopEdit, title: e.target.value})} placeholder="Title" className="w-full p-2 border rounded" required/>
                            <input value={newTopEdit.description} onChange={e => setNewTopEdit({...newTopEdit, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded" required/>
                            <input value={newTopEdit.img_url} onChange={e => setNewTopEdit({...newTopEdit, img_url: e.target.value})} placeholder="Image URL" className="w-full p-2 border rounded" required/>
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded">Add Edit</button>
                        </form>
                    </div>
                );
        }
    };

    const TabButton: React.FC<{ tabName: Tab, label: string }> = ({ tabName, label }) => (
        <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 rounded-t-lg ${activeTab === tabName ? 'bg-white border-b-0 border' : 'bg-gray-100'}`}>
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-700">Admin Dashboard</h1>
                <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
            </header>
            <main className="p-8 max-w-4xl mx-auto">
                <div className="flex border-b mb-4">
                    <TabButton tabName="messages" label="Messages" />
                    <TabButton tabName="skills" label="Skills" />
                    <TabButton tabName="portfolio" label="Portfolio" />
                    <TabButton tabName="top-edits" label="Top Edits" />
                </div>
                <div className="bg-white p-6 rounded-b-lg rounded-r-lg shadow-md">
                   {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
