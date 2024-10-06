import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

    const RoutesApp = () => {
        return (
            <BrowserRouter>
                <Fragment>
                    <Routes>
                        <Route exact path="/home" element={<Private Item={Home} />} />
                    </Routes>
                </Fragment>
            </BrowserRouter>
        ) ;
    };

    export default RoutesApp;

