import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CommonSideModal from '@/components/CommonSideModal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';
import { useDispatch, useSelector } from 'react-redux';
import { useWorkspace } from '@/hooks/useWorkspace';
import { fetchUser } from '@/store/authSlice';

const EditProfile = (props, forwardedRef) => {
    const { user } = useSelector((state) => state.auth);

    const SideModal = useRef();
    const defaultParams = { name: '', email: '' };
    const [params, setParams] = useState(defaultParams);

    const dispatch = useDispatch();

    useImperativeHandle(forwardedRef, () => ({
        open() {
            setParams({ ...params, name: user?.name, email: user?.email });
            SideModal?.current?.open();
        },
        close() {
            SideModal?.current.close();
        },
    }));
    const formHandler = async (values) => {
        try {
            await axios.post(`/auth/${user?.id}`, values);
            SideModal?.current.close();
            dispatch(fetchUser());
        } catch {}
    };

    return (
        <div>
            <CommonSideModal ref={SideModal} title="Edit Profile">
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting }) => (
                                <Form className="w-full space-y-5  bg-white pt-[25px]">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Email</label>

                                            <Field
                                                name="email"
                                                type="text"
                                                className="form-input rounded-l-none opacity-60"
                                                placeholder="Email"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className='sticky bottom-0 bg-white py-[25px] !mt-0'>
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

export default forwardRef(EditProfile);
