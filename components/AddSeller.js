import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CommonSideModal from '@/components/CommonSideModal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';

const AddSeller = (props, forwardedRef) => {
    const SideModal = useRef();
    const defaultParams = { id: '', name: '', email: '', phone_number: '', address: '' };
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
            await axios.post('/sellers', values);
            props.refresh();
            SideModal?.current.close();
        } catch {}
    };

    return (
        <div>
            <CommonSideModal ref={SideModal} title="Add Seller">
                <div className="space-y-12">
                    <div className="border-gray-900/10">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting }) => (
                                <Form className="w-full space-y-5  bg-white pt-[25px]">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Seller Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div className="flex space-x-5">
                                            <div className="w-1/2">
                                                <label className="form-label">Email</label>

                                                <Field
                                                    name="email"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="example@mail.com"
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="form-label">Phone</label>

                                                <Field
                                                    name="phone_number"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Phone"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Address</label>

                                            <Field
                                                as="textarea"
                                                name="address"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Address"
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

export default forwardRef(AddSeller);
