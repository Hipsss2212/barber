import { useEffect, useRef } from 'react';

const useScrollAnimation = () => {
    const elementsRef = useRef([]);

    const addToRefs = (el) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.03, // Kích hoạt khi 10% phần tử hiển thị
                rootMargin: '0px 0px -50px 0px' // Giảm kích thước viewport một chút
            }
        );

        elementsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            elementsRef.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return addToRefs;
};

export default useScrollAnimation;