import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Skill, PortfolioItem, TopEdit, Message, HeroContent } from '../../types';

type Tab = 'hero' | 'skills' | 'portfolio' | 'top-edits' | 'messages';

const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('hero');
    const [loading, setLoading] = useState(false);
    
    // Data states
    const [skills, setSkills] = useState<Skill[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [topEdits, setTopEdits] = useState<TopEdit[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [heroContent, setHeroContent] = useState<HeroContent | null>(null);

    // Form states
    const [newSkill, setNewSkill] = useState({ name: '', img_url: '' });
    const [newSkillFile, setNewSkillFile] = useState<File | null>(null);

    const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', img_url: '', project_url: '' });
    const [newPortfolioFile, setNewPortfolioFile] = useState<File | null>(null);

    const [newTopEdit, setNewTopEdit] = useState({ title: '', description: '', img_url: '' });
    const [newTopEditFile, setNewTopEditFile] = useState<File | null>(null);
    
    const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', description: '', image_url: '' });
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);


    const fetchData = async () => {
        setLoading(true);
        const { data: skillsData } = await supabase.from('skills').select('*').order('id');
        setSkills(skillsData || []);
        const { data: portfolioData } = await supabase.from('portfolio_items').select('*').order('id');
        setPortfolioItems(portfolioData || []);
        const { data: editsData } = await supabase.from('top_edits').select('*').order('id');
        setTopEdits(editsData || []);
        const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        setMessages(messagesData || []);
        const { data: heroData } = await supabase.from('hero_content').select('*').single();
        if (heroData) {
            setHeroContent(heroData);
            setHeroForm(heroData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('portfolio-images') // Ganti dengan nama bucket Anda
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('portfolio-images') // Ganti dengan nama bucket Anda
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image: ', error);
            alert('Error uploading image: ' + (error as Error).message);
            return null;
        }
    };

    const handleDelete = async (table: string, id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setLoading(true);
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) alert('Error deleting item: ' + error.message);
            await fetchData();
            setLoading(false);
        }
    };

    const handleAdd = async (table: string, data: any, file: File | null) => {
        setLoading(true);
        let finalData = { ...data };

        if (file) {
            const imageUrl = await uploadImage(file);
            if (!imageUrl) {
                setLoading(false);
                return; // Stop if image upload fails
            }
            finalData.img_url = imageUrl;
        }
        
        const { error } = await supabase.from(table).insert([finalData]);
        if (error) {
            alert('Error adding item: ' + error.message);
        } else {
             // Reset forms
            setNewSkill({ name: '', img_url: '' });
            setNewSkillFile(null);
            setNewPortfolio({ title: '', description: '', img_url: '', project_url: '' });
            setNewPortfolioFile(null);
            setNewTopEdit({ title: '', description: '', img_url: '' });
            setNewTopEditFile(null);
            await fetchData();
        }
        setLoading(false);
    };
    
    const handleUpdateHero = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let updatedData = { ...heroForm };

        if (heroImageFile) {
            const imageUrl = await uploadImage(heroImageFile);
            if (!imageUrl) {
                setLoading(false);
                return; // Stop if upload fails
            }
            updatedData.image_url = imageUrl;
        }

        const { error } = await supabase
            .from('hero_content')
            .update(updatedData)
            .eq('id', 1);
            
        if (error) {
            alert('Error updating hero content: ' + error.message);
        } else {
            alert('Hero content updated successfully!');
            setHeroImageFile(null);
            await fetchData();
        }
        setLoading(false);
    };

    const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setter(e.target.files[0]);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="text-center p-8">Loading data...</div>;
        switch (activeTab) {
            case 'hero':
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Manage Hero Section</h2>
                        <form onSubmit={handleUpdateHero} className="p-4 border rounded bg-gray-50 space-y-3">
                            <div>
                                <label className="block font-semibold mb-1">Title</label>
                                <input name="title" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                             <div>
                                <label className="block font-semibold mb-1">Subtitle</label>
                                <input name="subtitle" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                             <div>
                                <label className="block font-semibold mb-1">Description</label>
                                <textarea name="description" value={heroForm.description} onChange={e => setHeroForm({...heroForm, description: e.target.value})} rows={3} className="w-full p-2 border rounded" required></textarea>
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Profile Image</label>
                                {heroForm.image_url && !heroImageFile && <img src={heroForm.image_url} alt="Current" className="w-24 h-24 object-cover rounded mb-2"/>}
                                <input type="file" accept="image/*" onChange={handleFileChange(setHeroImageFile)} className="w-full p-2 border rounded" />
                                <p className="text-xs text-gray-500 mt-1">Select a new image to replace the current one.</p>
                            </div>
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                        </form>
                    </div>
                );
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
                                    <button onClick={() => handleDelete('messages', msg.id)} className="text-red-500 text-xs mt-2" disabled={loading}>Delete</button>
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
                            {skills.map(s => (<div key={s.id} className="flex items-center justify-between p-2 border rounded"><img src={s.img_url} alt={s.name} className="w-8 h-8"/><span>{s.name}</span><button onClick={() => handleDelete('skills', s.id)} className="text-red-500" disabled={loading}>Delete</button></div>))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAdd('skills', newSkill, newSkillFile); }} className="p-4 border rounded bg-gray-50 space-y-3">
                            <h3 className="font-bold">Add New Skill</h3>
                            <input value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} placeholder="Skill Name" className="w-full p-2 border rounded" required />
                            <input type="file" accept="image/*" onChange={handleFileChange(setNewSkillFile)} className="w-full p-2 border rounded" required />
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded" disabled={loading}>{loading ? 'Adding...' : 'Add Skill'}</button>
                        </form>
                    </div>
                );
             case 'portfolio':
                return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Manage Portfolio</h2>
                         <div className="space-y-2 mb-6">
                            {portfolioItems.map(p => (<div key={p.id} className="flex items-center justify-between p-2 border rounded"><span>{p.title}</span><button onClick={() => handleDelete('portfolio_items', p.id)} className="text-red-500" disabled={loading}>Delete</button></div>))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAdd('portfolio_items', newPortfolio, newPortfolioFile); }} className="p-4 border rounded bg-gray-50 space-y-3">
                            <h3 className="font-bold">Add New Portfolio Item</h3>
                            <input value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} placeholder="Title" className="w-full p-2 border rounded" required/>
                            <textarea value={newPortfolio.description} onChange={e => setNewPortfolio({...newPortfolio, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded" required/>
                            <input value={newPortfolio.project_url} onChange={e => setNewPortfolio({...newPortfolio, project_url: e.target.value})} placeholder="Project URL" className="w-full p-2 border rounded" />
                            <input type="file" accept="image/*" onChange={handleFileChange(setNewPortfolioFile)} className="w-full p-2 border rounded" required />
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded" disabled={loading}>{loading ? 'Adding...' : 'Add Item'}</button>
                        </form>
                    </div>
                );
            case 'top-edits':
                 return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Manage Top Edits</h2>
                         <div className="space-y-2 mb-6">
                            {topEdits.map(e => (<div key={e.id} className="flex items-center justify-between p-2 border rounded"><span>{e.title}</span><button onClick={() => handleDelete('top_edits', e.id)} className="text-red-500" disabled={loading}>Delete</button></div>))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAdd('top_edits', newTopEdit, newTopEditFile); }} className="p-4 border rounded bg-gray-50 space-y-3">
                            <h3 className="font-bold">Add New Top Edit</h3>
                            <input value={newTopEdit.title} onChange={e => setNewTopEdit({...newTopEdit, title: e.target.value})} placeholder="Title" className="w-full p-2 border rounded" required/>
                            <textarea value={newTopEdit.description} onChange={e => setNewTopEdit({...newTopEdit, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded" required/>
                            <input type="file" accept="image/*" onChange={handleFileChange(setNewTopEditFile)} className="w-full p-2 border rounded" required />
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded" disabled={loading}>{loading ? 'Adding...' : 'Add Edit'}</button>
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
                <div className="flex border-b mb-4 flex-wrap">
                    <TabButton tabName="hero" label="Hero" />
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
