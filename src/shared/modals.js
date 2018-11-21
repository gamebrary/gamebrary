import swal from 'sweetalert2/dist/sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export function $error(title) {
    swal({
        title,
        toast: true,
        timer: 1500,
        position: 'bottom-end',
        type: 'error',
        showConfirmButton: false,
    });
}

export function $success(title) {
    swal({
        position: 'bottom-end',
        title,
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 1500,
    });
}

export { swal };
