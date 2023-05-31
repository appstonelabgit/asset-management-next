import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CommonSideModal from '@/components/CommonSideModal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';

const AddBrand = (props, forwardedRef) => {
    const SideModal = useRef();
    const defaultParams = { id: '', name: '', image_url: '' };
    const [params, setParams] = useState(defaultParams);

    useImperativeHandle(forwardedRef, () => ({
        open() {
            setParams({ id: '', name: '', image_url: '' });
            SideModal?.current.open();
        },
        close() {
            SideModal?.current.close();
        },
    }));

    const formHandler = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('logo_url', values.logo_url);
            await axios.post('/brands', formData);
            props.refresh();
            SideModal?.current.close();
        } catch {}
    };

    return (
        <div>
            <CommonSideModal ref={SideModal} title="Add brand">
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
                                <Form className="w-full space-y-5  bg-white pt-[25px]">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Brand Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Brand logo</label>

                                            {params?.image_url && (
                                                <img src={params?.image_url} className="my-2 w-40 rounded-xl" alt="" />
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
                                    <div className="sticky bottom-0 !mt-0 bg-white py-[25px]">
                                        <ButtonField type="submit" loading={isSubmitting} className="btn block w-full">
                                            Add
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

export default forwardRef(AddBrand);
