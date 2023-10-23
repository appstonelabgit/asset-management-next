import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CommonSideModal from '@/components/CommonSideModal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';
import { useDispatch, useSelector } from 'react-redux';
import { useWorkspace } from '@/hooks/useWorkspace';
import { fetchUser } from '@/store/authSlice';
import Image from 'next/image';

const EditCompany = (props, forwardedRef) => {
    const SideModal = useRef();
    const defaultParams = { name: '' };
    const [params, setParams] = useState(defaultParams);
    const { workspace } = useWorkspace();
    const dispatch = useDispatch();

    const handleEdit = (id) => {
        try {
            axios.get(`/companies/${id}`).then(({ data }) => {
                setParams({ ...params, name: data?.name, logo_url: '', image_url: data?.image_url });
                SideModal?.current?.open();
            });
        } catch (error) {}
    };

    useImperativeHandle(forwardedRef, () => ({
        open() {
            handleEdit(workspace?.id);
        },
        close() {
            SideModal?.current.close();
        },
    }));

    const formHandler = async (values) => {
        try {
            const formData = new FormData();
            formData.append('logo_url', values?.logo_url);
            formData.append('company_name', values?.name);
            await axios.post(`/companies/${workspace?.id}`, formData);
            SideModal?.current.close();
            dispatch(fetchUser());
        } catch {}
    };

    return (
        <div>
            <CommonSideModal ref={SideModal} title="Edit Company Details" width="400px">
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
                                <Form className="w-full space-y-5  bg-white pt-[25px] pb-[88px]">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Company Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Company Name..."
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Company Logo</label>
                                            {params?.image_url && (
                                                <Image
                                                    src={params?.image_url}
                                                    className="my-2 w-40 rounded-xl"
                                                    alt=""
                                                />
                                            )}
                                            <input
                                                name="logo_url"
                                                type="file"
                                                className="form-input rounded-l-none"
                                                onChange={(e) => {
                                                    setParams({
                                                        ...params,
                                                        image_url: URL.createObjectURL(e.target.files[0]),
                                                    });
                                                    setFieldValue('logo_url', e.target.files[0]);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-5 bottom-0 !mt-0 bg-white py-[25px]">
                                        <ButtonField type="submit" loading={isSubmitting} className="btn block w-full">
                                            Edit
                                        </ButtonField>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </CommonSideModal>
        </div>
    );
};

export default forwardRef(EditCompany);
