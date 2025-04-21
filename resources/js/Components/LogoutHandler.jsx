import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { clearUserMissions } from '@/Utilities/missionStorage';

export default function LogoutHandler() {
    const { flash } = usePage().props;
    
    useEffect(() => {
        if (flash.clearedUserId) {
            clearUserMissions(flash.clearedUserId);
        }
    }, [flash.clearedUserId]);

    return null;
}