import { useAuth } from '@/hooks/useAuth';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';

const Login = () => {
    const { login } = useAuth();
    const params = { email: 'sbthemes@gmail.com', password: 'sb123admin' };

    const formHandler = async (values) => {
        await login(values);
    };

    return (
        <div className=" min-h-screen">
            <div className="flex min-h-[calc(100vh-77px)] items-center justify-center p-4">
                <div className="mx-auto w-full max-w-[600px] space-y-[25px] rounded bg-white p-[25px]">
                    <div className="flex flex-col items-center justify-center space-y-5 text-4xl font-extrabold text-darkprimary">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-darkprimary text-white">
                            A
                        </div>
                        <div className="text-3xl">Assets</div>
                    </div>
                    <h1 className="text-center text-[22px] font-semibold leading-7">Sign in</h1>

                    <Formik initialValues={params} onSubmit={formHandler}>
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div className="relative">
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

                                <div>
                                    <Link
                                        href="/forgot-password"
                                        className="text-darkblue underline transition-all duration-300 hover:text-primary"
                                    >
                                        Forgot Password
                                    </Link>
                                </div>
                                <div>
                                    <button disabled={isSubmitting} type="submit" className="btn mt-6 block w-full">
                                        Login
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <p className="text-center text-lightblack">
                        Not registered?{' '}
                        <Link
                            href="/register"
                            className="text-darkblue underline transition-all duration-300 hover:text-primary"
                        >
                            Sign up
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

Login.middleware = {
    auth: false,
};

Login.layout = 'nosidebar';
