// src/services/timeService.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { fetchTimes, clearTimeError, resetTimes } from '../stores/slices/timeSlice';

const useTimeService = () => {
    const dispatch = useDispatch();
    const { times, loading, error } = useSelector((state) => state.time);

    const getTimesByEmployee = useCallback(
        async (employeeId, date) => {
            try {
                dispatch(clearTimeError());
                const resultAction = await dispatch(fetchTimes({ employeeId, date }));

                if (fetchTimes.fulfilled.match(resultAction)) {
                    return resultAction.payload;
                }
                throw new Error(resultAction.payload || 'Failed to get time data');
            } catch (error) {
                console.error('Error fetching times:', error);
                throw error;
            }
        },
        [dispatch]
    );

    const getCombinedTimes = useCallback(
        async (employeeIds, date) => {
            try {
                const allTimes = await Promise.all(
                    employeeIds.map(id => getTimesByEmployee(id, date))
                );

                const timeMap = new Map();
                allTimes.flat().forEach(time => {
                    const key = time.timeName;
                    timeMap.has(key) ? timeMap.get(key).push(time.isBusy) : timeMap.set(key, [time.isBusy]);
                });

                return Array.from(timeMap.entries())
                    .filter(([_, statuses]) => statuses.every(s => s === 0))
                    .map(([time]) => ({ timeName: time }))
                    .sort((a, b) => a.timeName.localeCompare(b.timeName));
            } catch (error) {
                console.error('Error combining times:', error);
                throw error;
            }
        },
        [getTimesByEmployee]
    );

    return {
        times,
        loading,
        error,
        getTimesByEmployee,
        getCombinedTimes,
        resetTimes: () => dispatch(resetTimes()),
        clearTimeError: () => dispatch(clearTimeError())
    };
};

export default useTimeService;