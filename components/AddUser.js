import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CommonSideModal from '@/components/CommonSideModal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';

const AddUser = (props, forwardedRef) => {
    const SideModal = useRef();
    const defaultParams = { id: '', name: '', email: '', password: '', password_confirmation: '', designation: '' };

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
            await axios.post('/users', values);
            props.refresh('user_id', values);
            SideModal?.current.close();
        } catch {}
    };

    return (
        <div>
            <CommonSideModal ref={SideModal} title="Add Employee" width="400px">
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting }) => (
                                <Form className="w-full bg-white pt-[25px] pb-[88px]">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="form-label">Employee Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Name"
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">Email</label>

                                            <Field
                                                name="email"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="example@mail.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">Designation</label>

                                            <Field
                                                name="designation"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Designation"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-5 bottom-0 !mt-0 bg-white py-[25px] text-right">
                                        <ButtonField type="submit" loading={isSubmitting} className="btn px-4">
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

export default forwardRef(AddUser);
