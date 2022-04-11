import React, { Fragment } from 'react';

// Components
import Collapsible from '../../../../ui/Collapsible/Collapsible';

// Data
import { faqData } from '../../../../../data/layouts/sample-faq';

// Styles
import './FAQ.scss';

const FAQ = () => {
    return (
        <div className="_faq">
            <div className="container">
                <div className="row">
                    <h2 className="display-5 fw-bold text-center" style={{ color: '#1c1c1c' }}>
                        FAQ
                    </h2>

                    <br />
                    <br />
                    <br />
                    <br />

                    {faqData.map(({ question, answer }, i) => (
                        <Fragment key={`${i}id`}>
                            <Collapsible question={question} answer={answer} />
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
