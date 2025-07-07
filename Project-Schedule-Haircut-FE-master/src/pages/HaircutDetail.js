import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceDetail from "../components/ServiceDetail";
import useMenuItemsService from "../services/menuItemsService";
import { ClipLoader } from "react-spinners";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HaircutDetail = () => {
    const { categoryId } = useParams();
    const { getServicesAndCombos } = useMenuItemsService();

    const [serviceData, setServiceData] = useState({ serviceDTOS: [], comboDTOS: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getServicesAndCombos(categoryId);
                setServiceData(data);
                // console.log(data);

            } catch (error) {
                console.error("Failed to fetch service data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchData();
        }
    }, [categoryId, getServicesAndCombos]);

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ display: 'flex', justifyContent: 'center', marginBottom: 260, marginTop: 260 }}>
                    <ClipLoader color="#3498db" size={50} />
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <ServiceDetail
                title="DỊCH VỤ TÓC"
                subtitle="Trải nghiệm cắt tóc phong cách dành riêng cho phái mạnh, vừa tiện lợi vừa thư giãn tại đây"
                services={serviceData.services}
                combos={serviceData.combos}
            />
            <Footer />
        </>
    );
};

export default HaircutDetail;
