import { useAuth } from '@/hooks/useAuth';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';

const Register = () => {
    const { register } = useAuth();
    const params = {
        name: 'Shailesh Savaliya',
        email: 'sbthemes@gmail.com',
        password: 'sb123admin',
    };

    const formHandler = async (values) => {
        await register(values);
    };

    return (
        <div className="min-h-screen">
            <div className="flex min-h-[calc(100vh-77px)] items-center justify-center p-4">
                <div className="mx-auto w-full max-w-[600px] space-y-[25px] rounded bg-white p-[25px]">
                    <div className="flex flex-col items-center justify-center space-y-5 text-4xl font-extrabold text-darkprimary">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-darkprimary text-white">
                            A
                        </div>
                        <div className="text-3xl">Assets</div>
                    </div>
                    <h1 className="text-center text-[22px] font-semibold leading-7">Sign up</h1>
                    <Formik initialValues={params} onSubmit={formHandler}>
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="form-label">Full name</label>
                                    <div>
                                        <Field
                                            name="name"
                                            type="text"
                                            className="form-input"
                                            placeholder="Full name..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Email address</label>
                                    <div>
                                        <Field
                                            name="email"
                                            type="text"
                                            className="form-input"
                                            placeholder="Email address..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Password</label>
                                    <div>
                                        <Field
                                            name="password"
                                            type="password"
                                            className="form-input"
                                            placeholder="Password..."
                                        />
                                    </div>
                                </div>

                                <div className="text-right">
                                    <button disabled={isSubmitting} type="submit" className="btn mt-6 block w-full">
                                        Sign up
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <p className=" text-center text-lightblack">
                        Not registered?{' '}
                        <Link
                            href="/login"
                            className="text-darkblue underline transition-all duration-300 hover:text-primary"
                        >
                            Sign in
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

Register.middleware = {
    auth: false,
};

Register.layout = 'nosidebar';
