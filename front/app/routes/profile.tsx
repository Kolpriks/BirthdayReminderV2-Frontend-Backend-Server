import { useState } from "react"
import styles from "../profile.module.css"

const Login = ({ toggleForm }: { toggleForm: () => void }) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.headerText}>Login to your account</h2>
                <div className={styles.form}>
                    <div className={styles.fieldsGroup}>
                        <p>Your login:</p>
                        <input />
                    </div>
                    <div className={styles.fieldsGroup}>
                        <p>Your password:</p>
                        <input />
                    </div>
                    {/* TODO: добавить каптчу */}
                    <div className={styles.fieldsGroup}>
                        <button className={styles.submitButton}>Submit</button>
                    </div>
                    <div className={styles.fieldsGroup}>
                        <p className={styles.switchBetweenLoginAndReg} onClick={toggleForm}>Don't have an account?</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Registration = ({ toggleForm }: { toggleForm: () => void }) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.headerText}>Registrate your account</h2>
                <div className={styles.form}>
                    <div className={styles.fieldsGroup}>
                        <p>Your login:</p>
                        <input />
                    </div>
                    <div className={styles.fieldsGroup}>
                        <p>Your password:</p>
                        <input />
                    </div>
                    <div className={styles.fieldsGroup}>
                        <p>Repeat your password:</p>
                        <input />
                    </div>
                    {/* TODO: добавить каптчу */}
                    <div className={styles.fieldsGroup}>
                        <button className={styles.submitButton}>Submit</button>
                    </div>
                    <div className={styles.fieldsGroup}>
                        <p className={styles.switchBetweenLoginAndReg} onClick={toggleForm}>Already have an account?</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Profile() {
    // TODO: Реализовать получение токена от бд по кредам
    const token = false
    const [isRegistration, setIsRegistration] = useState(false)

    const toggleForm = () => {
        setIsRegistration((prev) => !prev)
    }

    if (token) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <p>Страница аккаунта пользователя</p>
                </div>
            </div>
        );
    } else {
        return isRegistration ? (
            <Registration toggleForm={toggleForm} />
        ) : (
            <Login toggleForm={toggleForm} />
        )
    }
}

