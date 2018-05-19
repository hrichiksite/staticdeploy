import { IApp } from "@staticdeploy/common-types";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
import AppForm, { IAppFormInstance } from "../../components/AppForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IApp> {}

interface IProps {
    history: History;
    trigger: React.ReactNode;
    refetchAppsList: () => void;
}

export default class AppCreateOperationModal extends React.Component<IProps> {
    form!: IAppFormInstance;
    createApp = () => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.apps.create(values);
    };
    refetchAppsListAndGoToAppDetail = (app: IApp) => {
        this.props.refetchAppsList();
        this.props.history.push(`/apps/${app.id}`);
    };
    render() {
        return (
            <OperationModal
                title="Create app"
                operation={this.createApp}
                trigger={this.props.trigger}
                startOperationButtonText="Create"
                onAfterSuccessClose={this.refetchAppsListAndGoToAppDetail}
                successMessage={createdApp => (
                    <span>
                        {"Created app "}
                        {emphasizeString(createdApp.name)}
                        {" with id "}
                        {emphasizeString(createdApp.id)}
                    </span>
                )}
            >
                <AppForm ref={form => (this.form = form!)} />
            </OperationModal>
        );
    }
}
