import { useRef } from 'react';
import classes from './ModalOverlay.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Card from '../../../UI/Card/Card';
import Accordion from '../../../UI/Accordion/Accordion';

const ModalOverlay = (props) => {
    const accordionRef = useRef();
    const types = 'types', genders = 'genders';
    

    const onClickApply = () => {
        accordionRef.current.applyFilters();

        props.onConfirm();
    }

    const onClickReset = () => {
        accordionRef.current.resetFilters();
    }

    return (
        <Card className={`${classes.modal}`}>
            <div className="container bg-white h-100 position-relative">
                <header className={`${classes.header} clearfix`}>
                    <h2>{props.title}</h2>
                    <FontAwesomeIcon icon={faCircleXmark} size="2x" className={classes.close} onClick={props.onConfirm} />
                    <hr />
                </header>
                <div className={classes.content}>
                    <Accordion 
                        ref={accordionRef}
                        types={types}
                        genders={genders}
                    ></Accordion>
                </div>
                <footer className={classes.actions}>
                    <button type="button" className={`btn btn-outline-dark ${classes.action_btns}`} onClick={onClickReset}>Reset</button>
                    <button type="button" className={`btn btn-dark ${classes.action_btns}`} onClick={onClickApply}>Apply</button>
                </footer>
            </div>
        </Card>
    );
};

export default ModalOverlay;