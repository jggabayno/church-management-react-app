import Form from 'antd/lib/form'
import Modal from 'antd/lib/modal'
import Button from '../shared/Button'

export default function FormModal(props) {

    const { children, modalTitle, actionType, formId, form, isVisible, closeModal, isLoading, onSubmit, modalWidth = 800 } = props


    const hasCustomAddModeTitle = props.hasOwnProperty('customAddModeTitle')

    const title = (hasCustomAddModeTitle && actionType === 'view') ? props.customAddModeTitle : `${actionType === 'edit' ? 'Edit' : actionType === 'delete' ? 'Delete' : actionType === 'view' ? 'View' : 'Add'} ${modalTitle}`

    function constructFooter() {

        const defaultAction = [
            <Button key={1} type='ghost' onClick={closeModal}>Cancel</Button>,
            <Button key={2} form={formId} type='primary' htmlType='submit' loading={isLoading}>Submit</Button>
        ]

        const hasFooterProps = props.hasOwnProperty('footer')
        if (actionType === 'view') {
            return false
        } else if (actionType === 'edit') {
            return defaultAction
        } else if (hasFooterProps) {
            return props.footer
        }

        return defaultAction
    }

    return (
        <Modal
            visible={isVisible}
            title={title}
            maskClosable={false}
            onCancel={closeModal}
            width={modalWidth}
            closable
            forceRender
            getContainer={false}
            {...props}
            footer={constructFooter()}

        >
            <Form
                form={form}
                id={formId}
                onFinish={onSubmit}
                autoComplete="off"
                layout='vertical'
                requiredMark={false}
                style={{ display: actionType === 'view' ? 'block' : '' }}
                initialValues={props?.initialValues || {}}
            > {children}</Form>
        </Modal>
    )
}
