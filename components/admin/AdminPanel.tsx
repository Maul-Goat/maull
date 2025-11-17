import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Skill, PortfolioItem, TopEdit, Message, HeroContent, VisitorLog } from '../../types';

type Tab = 'hero' | 'skills' | 'portfolio' | 'top-edits' | 'messages' | 'analytics';

type AddableData = Partial<Omit<Skill, 'id'>> | Partial<Omit<PortfolioItem, 'id'>> | Partial<Omit<TopEdit, 'id'>>;


const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('analytics');
    const [loading, setLoading] = useState(false);
    
    // Data states
    const [skills, setSkills] = useState<Skill[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [topEdits, setTopEdits] = useState<TopEdit[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
    const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);

    // Form states
    const [newSkill, setNewSkill] = useState({ name: '', img_url: '' });
    const [newSkillFile, setNewSkillFile] = useState<File | null>(null);

    const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', img_url: '', project_url: '' });
    const [newPortfolioFile, setNewPortfolioFile] = useState<File | null>(null);

    const [newTopEdit, setNewTopEdit] = useState({ title: '', description: '', img_url: '', tiktok_url: '' });
    const [newTopEditFile, setNewTopEditFile] = useState<File | null>(null);
    
    const [heroForm, setHeroForm] = useState<HeroContent>({ id: 1, title: '', subtitle: '', description: '', image_url: '' });
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
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: logsData } = await supabase
            .from('visitor_logs')
            .select('*')
            .gte('created_at', thirtyDaysAgo.toISOString())
            .order('created_at', { ascending: false });
        setVisitorLogs(logsData || []);
        
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            const friendlyMessage = `Error uploading file to bucket "${bucket}": ${errorMessage}. Please ensure the bucket exists and has the correct policies in your Supabase dashboard.`;
            console.error(friendlyMessage);
            alert(friendlyMessage);
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

    const handleAdd = async (table: string, data: AddableData, file: File | null) => {
        setLoading(true);
        let finalData = { ...data };

        if (file) {
            let bucketName = 'portfolio-images'; // Default bucket for skills

            if (table === 'portfolio_items') {
                bucketName = 'portfolio-bucket';
            } else if (table === 'top_edits') {
                const bucketIndex = Math.floor(topEdits.length / 3) + 1;
                bucketName = `top-edits-${bucketIndex}`;
                console.log(`Attempting to upload to bucket: ${bucketName}. This bucket must exist in Supabase.`);
            }

            const fileUrl = await uploadFile(file, bucketName);
            if (!fileUrl) {
                setLoading(false);
                return; // Stop if file upload fails
            }
            (finalData as { img_url?: string }).img_url = fileUrl;
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
            setNewTopEdit({ title: '', description: '', img_url: '', tiktok_url: '' });
            setNewTopEditFile(null);
            await fetchData();
        }
        setLoading(false);
    };
    
    const handleUpdateHero = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let updatedData = { ...heroForm };
        const oldImageUrl = heroContent?.image_url; // Simpan URL gambar lama

        if (heroImageFile) {
            const newImageUrl = await uploadFile(heroImageFile, 'portfolio-images');
            if (!newImageUrl) {
                setLoading(false);
                return; // Hentikan jika unggahan gagal
            }
            updatedData.image_url = newImageUrl;
        }

        const { error } = await supabase
            .from('hero_content')
            .update(updatedData)
            .eq('id', heroContent?.id || 1);
            
        if (error) {
            alert('Error updating hero content: ' + error.message);
        } else {
            alert('Hero content updated successfully!');
            
            // Hapus gambar lama HANYA JIKA pembaruan berhasil DAN ada gambar baru yang diunggah
            if (heroImageFile && oldImageUrl) {
                try {
                    const url = new URL(oldImageUrl);
                    const pathParts = url.pathname.split('/');
                    const publicIndex = pathParts.indexOf('public');

                    if (publicIndex !== -1 && pathParts.length > publicIndex + 2) {
                        const bucketName = pathParts[publicIndex + 1];
                        const filePath = pathParts.slice(publicIndex + 2).join('/');
                        
                        const { error: deleteError } = await supabase.storage
                            .from(bucketName)
                            .remove([filePath]);

                        if (deleteError) {
                            console.warn("Failed to delete old hero image:", deleteError.message);
                        }
                    } else {
                        console.warn("Could not parse bucket/path from old URL:", oldImageUrl);
                    }
                } catch (e) {
                    console.error("Error parsing or deleting old image URL:", e);
                }
            }

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
            case 'analytics':
                const pageViews = visitorLogs.filter(log => log.event_type === 'PAGE_VIEW');
                const uniqueVisitors = new Set(pageViews.map(log => log.visitor_id)).size;
                const totalVisits = pageViews.length;
                const formSubmissions = visitorLogs.filter(log => log.event_type === 'FORM_SUBMIT').length;
                
                const visitsByDay = visitorLogs.reduce((acc, log) => {
                    if (log.event_type !== 'PAGE_VIEW') return acc;
                    const date = new Date(log.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD format
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const sortedDays = Object.entries(visitsByDay).sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
                const last7Days = sortedDays.slice(0, 7);

                const deviceData = pageViews.reduce((acc, log) => {
                    const device = log.device_type || 'Unknown';
                    acc[device] = (acc[device] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
                
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Visitor Analytics (Last 30 Days)</h2>
                            <button onClick={fetchData} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300" disabled={loading}>Refresh</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 p-4 rounded-lg border text-center">
                                <h3 className="text-gray-500 text-sm font-semibold">Total Visits</h3>
                                <p className="text-3xl font-bold text-pink-500">{totalVisits}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border text-center">
                                <h3 className="text-gray-500 text-sm font-semibold">Unique Visitors</h3>
                                <p className="text-3xl font-bold text-pink-500">{uniqueVisitors}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border text-center">
                                <h3 className="text-gray-500 text-sm font-semibold">Form Submissions</h3>
                                <p className="text-3xl font-bold text-pink-500">{formSubmissions}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                             <div className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="font-bold mb-2">Visits per Day</h3>
                                <ul>
                                    {last7Days.length > 0 ? last7Days.map(([date, count]) => (
                                        <li key={date} className="flex justify-between text-sm py-1 border-b">
                                            <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                            <span className="font-semibold">{count} visit(s)</span>
                                        </li>
                                    )) : <p className="text-sm text-gray-500">No visit data for the last 7 days.</p>}
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="font-bold mb-2">Visits by Device</h3>
                                 <ul>
                                    {Object.entries(deviceData).length > 0 ? Object.entries(deviceData).map(([device, count]) => (
                                        <li key={device} className="flex justify-between text-sm py-1 border-b">
                                            <span>{device}</span>
                                            <span className="font-semibold">{count} visit(s)</span>
                                        </li>
                                    )) : <p className="text-sm text-gray-500">No device data available.</p>}
                                </ul>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                            <div className="overflow-x-auto border rounded-lg max-h-96 overflow-y-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="p-3 text-left font-semibold">Time</th>
                                            <th className="p-3 text-left font-semibold">Event</th>
                                            <th className="p-3 text-left font-semibold">Device</th>
                                            <th className="p-3 text-left font-semibold">Visitor ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {visitorLogs.slice(0, 20).map(log => (
                                            <tr key={log.id} className="border-t hover:bg-gray-50">
                                                <td className="p-3">{new Date(log.created_at).toLocaleString()}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.event_type === 'PAGE_VIEW' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {log.event_type.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="p-3">{log.device_type}</td>
                                                <td className="p-3 font-mono text-xs text-gray-500" title={log.visitor_id}>{log.visitor_id.substring(0, 8)}...</td>
                                            </tr>
                                        ))}
                                        {visitorLogs.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center p-4 text-gray-500">No activity recorded yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
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
                            <input value={newTopEdit.tiktok_url || ''} onChange={e => setNewTopEdit({...newTopEdit, tiktok_url: e.target.value})} placeholder="TikTok URL (Optional)" className="w-full p-2 border rounded" />
                            <input type="file" accept="image/*,video/*" onChange={handleFileChange(setNewTopEditFile)} className="w-full p-2 border rounded" required />
                            <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded" disabled={loading}>{loading ? 'Adding...' : 'Add Edit'}</button>
                        </form>
                    </div>
                );
        }
    };

    const TabButton: React.FC<{ tabName: Tab, label: string }> = ({ tabName, label }) => (
        <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 rounded-t-lg transition-colors duration-200 ${activeTab === tabName ? 'bg-white border-b-0 border border-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-700">Admin Dashboard</h1>
                <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
            </header>
            <main className="p-4 md:p-8 max-w-5xl mx-auto">
                <div className="flex border-b border-gray-200 mb-[-1px] flex-wrap">
                    <TabButton tabName="analytics" label="Analytics" />
                    <TabButton tabName="hero" label="Hero" />
                    <TabButton tabName="messages" label="Messages" />
                    <TabButton tabName="skills" label="Skills" />
                    <TabButton tabName="portfolio" label="Portfolio" />
                    <TabButton tabName="top-edits" label="Top Edits" />
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-b-lg rounded-r-lg shadow-md border border-gray-200">
                   {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;