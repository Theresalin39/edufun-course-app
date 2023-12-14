import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase'; 
import CourseCard from '../components/CourseCard';
import Layout from '../components/Layout';
import PageLayout from '@/components/PageLayout';

const SavedCoursesPage = () => {
    const [savedCourses, setSavedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (term) => {
        setSearchTerm(term);
    };
    
    useEffect(() => {
        const fetchSavedCourses = async () => {
            setLoading(true);

            // Asynchronously get the current session
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (user) {
                const { data, error } = await supabase
                    .from('saved_courses')
                    .select(`
                        course (
                            id,
                            title,
                            description,
                            price,
                            thumbnail_url
                        )
                    `)
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error fetching saved courses:', error);
                } else {
                    setSavedCourses(data.map(item => item.course));
                }
            } else {
                // Handle the case where there is no user session
                console.error('User is not logged in');
            }

            setLoading(false);
        };

        fetchSavedCourses();
    }, []);

    if (loading) {
        return <Layout><div>Loading...</div></Layout>;
    }

    return (
        <Layout>
            <PageLayout title="Saved Courses" showSearchBar onSearch={handleSearch} />
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default SavedCoursesPage;
