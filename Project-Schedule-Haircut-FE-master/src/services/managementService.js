import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAccounts,
    fetchServices,
    fetchCombos,
    createEmployee,
    updateEmployee,
    clearManagementError,
    changeBlock,
    fetchAllTimes,
    addTimeForEmployee,
    removeTimeFromEmployee,
    createService,
    updateService,
    deleteService,
    createCombo,
    updateCombo,
    deleteCombo,
} from '../stores/slices/managementSlice';
import { message } from 'antd';

const useManagementService = () => {
    const dispatch = useDispatch();
    const managementState = useSelector((state) => state.management);

    const getAccounts = async () => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(fetchAccounts());

            if (fetchAccounts.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Failed to fetch customers';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const getServices = async () => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(fetchServices());

            if (fetchServices.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Failed to fetch services';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const getCombos = async () => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(fetchCombos());

            if (fetchCombos.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Failed to fetch combos';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const createNewEmployee = async (employeeData) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(createEmployee(employeeData));

            if (createEmployee.fulfilled.match(resultAction)) {
                message.success('Tạo nhân viên thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Tạo nhân viên thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const updateExistingEmployee = async (id, employeeData) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(updateEmployee({ id, employeeData }));

            if (updateEmployee.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload;
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const changeBlockStatus = async (id, isBlocked) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(changeBlock({ id, isBlocked }));

            if (changeBlock.fulfilled.match(resultAction)) {
                message.success(`Tài khoản đã được ${isBlocked ? 'chặn' : 'mở chặn'} thành công`);
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Cập nhật trạng thái tài khoản thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const getAllTimes = async () => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(fetchAllTimes());

            if (fetchAllTimes.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Failed to fetch all times';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const addTime = async (timeId, employeeId) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(addTimeForEmployee({ timeId, employeeId }));

            if (addTimeForEmployee.fulfilled.match(resultAction)) {
                message.success('Thêm giờ làm thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Thêm giờ làm thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const removeTime = async (timeId, employeeId) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(removeTimeFromEmployee({ timeId, employeeId }));

            if (removeTimeFromEmployee.fulfilled.match(resultAction)) {
                message.success('Xóa giờ làm thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Xóa giờ làm thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const createNewService = async (formData) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(createService(formData));

            if (createService.fulfilled.match(resultAction)) {
                message.success('Tạo dịch vụ thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Tạo dịch vụ thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            // message.error(error.message);
            throw error;
        }
    };

    const updateExistingService = async (id, formData) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(updateService({ id, formData }));

            if (updateService.fulfilled.match(resultAction)) {
                message.success('Cập nhật dịch vụ thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Cập nhật dịch vụ thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            message.error(error.message);
            throw error;
        }
    };

    const deleteServiceAction = async (id) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(deleteService(id));

            if (deleteService.fulfilled.match(resultAction)) {
                message.success('Xóa dịch vụ thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Xóa dịch vụ thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            message.error(error.message);
            throw error;
        }
    };

    const createNewCombo = async (formData) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(createCombo(formData));
            if (createCombo.fulfilled.match(resultAction)) {
                message.success('Tạo combo thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Tạo combo thất bại';
                throw new Error(errorMsg);
            }
        }
        catch (error) {
            message.error(error.message);
            throw error;
        }
    }

    const updateExistingCombo = async (id, formData) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(updateCombo({ id, formData }));

            if (updateCombo.fulfilled.match(resultAction)) {
                message.success('Cập nhật combo thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Cập nhật combo thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            message.error(error.message);
            throw error;
        }
    }

    const deleteComboAction = async (id) => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(deleteCombo(id));

            if (deleteCombo.fulfilled.match(resultAction)) {
                message.success('Xóa combo thành công');
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Xóa combo thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            message.error(error.message);
            throw error;
        }
    }


    return {
        getAccounts,
        getServices,
        getCombos,
        createNewEmployee,
        updateExistingEmployee,
        changeBlockStatus,
        getAllTimes,
        addTime,
        removeTime,
        createNewService,
        updateExistingService,
        deleteServiceAction,
        createNewCombo,
        updateExistingCombo,
        deleteComboAction,
        managementState,
    };
};

export default useManagementService;