import { useState, useEffect } from 'react';
import { Search, Linkedin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Pagination from '../components/Pagination';

interface HRContact {
    id: number;
    name: string;
    email: string | null;
    linkedin: string | null;
    title: string | null;
    company: string | null;
}

export default function HRContacts() {
    const [contacts, setContacts] = useState<HRContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('hr_contacts')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setContacts(data || []);
        } catch (error) {
            console.error('Error fetching HR contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter((contact) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (contact.name?.toLowerCase() || '').includes(query) ||
            (contact.title?.toLowerCase() || '').includes(query) ||
            (contact.company?.toLowerCase() || '').includes(query)
        );
    });

    const currentContacts = filteredContacts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1.5">HR Contacts Directory</h1>
                    <p className="text-base text-[#A0A0B0]">
                        Browse and connect with HR professionals and technical recruiters across top companies.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#111317] border border-gray-800 rounded-xl p-4">
                <div className="flex gap-3 items-center">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
                        <input
                            type="text"
                            placeholder="Search by name, company, or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111317]/80 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4F0F93]/50"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#4F0F93] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-[#111317] border border-gray-800 rounded-xl overflow-hidden shadow-lg w-full">
                    <table className="w-full">
                        <thead className="bg-[#111317] border-b border-gray-800">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-medium text-[#A0A0B0] w-16">#</th>
                                <th className="px-5 py-4 text-left text-sm font-medium text-[#A0A0B0]">Name</th>
                                <th className="px-5 py-4 text-left text-sm font-medium text-[#A0A0B0]">Title</th>
                                <th className="px-5 py-4 text-left text-sm font-medium text-[#A0A0B0]">Company</th>
                                <th className="px-5 py-4 text-center text-sm font-medium text-[#A0A0B0] w-24">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-base text-[#A0A0B0]">
                                        No HR contacts found.
                                    </td>
                                </tr>
                            ) : (
                                currentContacts.map((contact, index) => (
                                    <tr
                                        key={contact.id}
                                        className="border-b border-gray-800/50 hover:bg-[#111317] transition-colors"
                                    >
                                        <td className="px-5 py-4 text-sm text-[#A0A0B0]">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-base text-white font-medium">
                                                {contact.name || 'Unknown User'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-block px-2.5 py-1 text-xs font-medium bg-[#111317] border border-gray-800 text-[#D0D0E0] rounded shadow-sm">
                                                {contact.title || 'Recruiter'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-sm font-medium text-purple-400">
                                                {contact.company || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {contact.linkedin && contact.linkedin !== 'null' ? (
                                                    <a
                                                        href={contact.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                        title="LinkedIn Profile"
                                                    >
                                                        <Linkedin className="w-4 h-4" />
                                                    </a>
                                                ) : contact.email && contact.email !== 'null' ? (
                                                    <a
                                                        href={`mailto:${contact.email}`}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-colors"
                                                        title="Email Contact"
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600 text-xs">-</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {filteredContacts.length > 0 && (
                        <div className="border-t border-gray-800 bg-[#111317]">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
