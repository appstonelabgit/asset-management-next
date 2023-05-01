import classNames from 'classnames';
import IconLoaderDots from '@/components/Icon/IconLoaderDots';

const ButtonField = ({ children, onClick, className, type, loading, disabled }) => {
    return (
        <button
            type={type || 'submit'}
            disabled={loading || disabled || false}
            className={`${className} btn relative`}
            onClick={onClick}
        >
            <span className={classNames({ invisible: loading }, 'flex items-center justify-center gap-2')}>{children}</span>
            <span className={classNames({ hidden: !loading }, 'absolute inset-0 flex items-center justify-center')}>
                <IconLoaderDots className="w-10" />
            </span>
        </button>
    );
};

export default ButtonField;
