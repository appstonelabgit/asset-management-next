import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CommonSideModal from '@/components/CommonSideModal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';
import Flatpickr from 'react-flatpickr';
import helper from '@/libs/helper';

const AddSeller = (props, forwardedRef) => {
    const SideModal = useRef();
    const defaultParams = {
        id: '',
        name: '',
        serial_number: '',
        description: '',
        purchased_at: '',
        purchased_cost: '',
        warranty_expired_at: '',
    };
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
            await axios.post('/assets', values);
            props.refresh('asset_id', values);
            SideModal?.current.close();
        } catch {}
    };

    return (
        <div>
            <CommonSideModal ref={SideModal} title="Add Asset" width="400px">
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
                                <Form className="w-full bg-white pt-[25px] pb-[88px]">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="form-label">Asset Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Serial Number</label>

                                            <Field
                                                name="serial_number"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Serial Number"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Description</label>

                                            <Field
                                                as="textarea"
                                                name="description"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Description"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Purchase Date</label>

                                            <Flatpickr
                                                name="purchased_at"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="YYYY-MM-DD"
                                                options={{
                                                    disableMobile: 'true',
                                                }}
                                                onChange={(date) =>
                                                    setFieldValue('purchased_at', helper.getFormattedDate2(date[0]))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label">
                                                Purchase Cost <span className="text-black/30">( In rupee (₹) )</span>
                                            </label>

                                            <Field
                                                name="purchased_cost"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Cost"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Warranty Expiry Date</label>

                                            <Flatpickr
                                                name="warranty_expired_at"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="YYYY-MM-DD"
                                                options={{
                                                    disableMobile: 'true',
                                                }}
                                                onChange={(date) => {
                                                    setFieldValue(
                                                        'warranty_expired_at',
                                                        helper.getFormattedDate2(date[0])
                                                    );
                                                }}
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

export default forwardRef(AddSeller);
