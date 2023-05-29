const helper = {
    isEmpty: (value) => {
        return value || '-';
    },

    formatTime(d) {
        let date = new Date(d);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeString = hours + ':' + minutes + ' ' + ampm;
        return timeString;
    },

    getFormattedDate(d) {
        const dateObj = new Date(d);
        const day = dateObj.getDate();
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        return `${day} ${month} ${year}`;
    },

    getFormattedDate2(d) {
        const dateObj = new Date(d);
        const day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
        const month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        return `${year}-${month}-${day}`;
    },

    trancateString(s) {
        if (s) {
            if (s.length > 20) {
                return `${s.substr(0, 20)}...`;
            } else {
                return s;
            }
        } else {
            return s;
        }
    },

    trancateSmallString(s) {
        if (s) {
            if (s.length > 10) {
                return `${s.substr(0, 10)}...`;
            } else {
                return s;
            }
        } else {
            return s;
        }
    },

    formatIndianCurrency(price) {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        });

        return formatter.format(price);
    },
};
export default helper;
