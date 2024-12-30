import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css'
import { StoreContext } from '../../context/StoreContext';
import './PaymentModal.css'

const PaymentModal = () => {

    const { getTotalCartAmount } = useContext(StoreContext)
    const Bank = {
        BankID: "BIDV",
        Account: "2143274158",
        Name: "Nguyen%20Quoc%20Anh"
    }
    const [QR, setQR] = useState("")

    const getQR = () => {
        if (getTotalCartAmount()) {
            const amount = getTotalCartAmount() + 20000;
            console.log(getTotalCartAmount());
            setQR("https://img.vietqr.io/image/" + Bank.BankID + "-" + Bank.Account + "-print.png?amount=" + amount + "&addInfo=" + "%20thanh%20toan" + "&accountName=" + Bank.Name)
        }
    }

    const [show, setShow] = useState(true)

    const handleClose = () => { setShow(false) };
    const handleShow = () => { setShow(true) };

    useEffect(() => {
        getQR()
    }, [getTotalCartAmount()])

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Launch static backdrop modal
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='qr'>
                        <img src={QR} alt="" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PaymentModal;