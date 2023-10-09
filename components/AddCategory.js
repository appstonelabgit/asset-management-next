import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CommonSideModal from '@/components/CommonSideModal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';

const AddCategory = (props, forwardedRef) => {
    const SideModal = useRef();
    const defaultParams = { id: '', name: '' };
    const [params, setParams] = useState(defaultParams);

    useImperativeHandle(forwardedRef, () => ({
        open() {
            SideModal?.current.open();
        },
        close() {
            SideModal?.current.close();
        },
    }));

    const formHandler = async (values) => {
        try {
            await axios.post('/categories', values);
            props.refresh();
            SideModal?.current.close();
        } catch {}
    };

    return (
        <div>
            <CommonSideModal ref={SideModal} title="Add Category" width="400px">
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting }) => (
                                <Form className="w-full space-y-5  bg-white pt-[25px] pb-[88px]">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Category Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-5 bottom-0 !mt-0 bg-white py-[25px]">
                                        <ButtonField type="submit" loading={isSubmitting} className="btn block w-full">
                                            {params?.id ? 'Edit' : 'Add'}
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

export default forwardRef(AddCategory);
