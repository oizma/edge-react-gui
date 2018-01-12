// @flow

import React, {Component} from 'react'
import {Picker, View} from 'react-native'

import IonIcon from 'react-native-vector-icons/Ionicons'

import s from '../../../../../locales/strings.js'
import ModalButtons from './ModalButtons.ui'
import StylizedModal from '../../../components/Modal/Modal.ui'

import styles from './styles'
import * as UTILS from '../../../../utils'

const DISABLE_TEXT = s.strings.string_disable
const DAYS_TEXT = s.strings.settings_days
const HOURS_TEXT = s.strings.settings_hours
const MINUTEST_TEXT = s.strings.settings_minutes
const SECONDS_TEXT = s.strings.settings_seconds

export type Props = {
  autoLogoutTimeInMinutes: number,
  onDone: Function,
  onCancel: Function
}

export type State = {
  timeNumber: number,
  timeMeasurement: string,
  showModal: boolean
}

export default class AutoLogoutModal extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    const {value, measurement} = UTILS.getTimeWithMeasurement(this.props.autoLogoutTimeInMinutes)
    this.state = {
      timeNumber: value,
      timeMeasurement: measurement,
      showModal: false
    }
  }

  onDone = (timeMeasurement: string, timeNumber: number) => {
    const minutes = UTILS.getTimeInMinutes({value: timeNumber, measurement: timeMeasurement})
    this.props.onDone(minutes)
  }

  onCancel = () => {
    this.setState({showModal: false})
    this.props.onCancel()
  }

  render () {
    const logoutNumberOptions = [{label: DISABLE_TEXT, value: Infinity}]
    for (let i = 1; i < 60; i++) {
      logoutNumberOptions.push({label: String(i), value: i})
    }
    const logoutPeriodOptions = [
      {label: SECONDS_TEXT, value: 'seconds'},
      {label: MINUTEST_TEXT, value: 'minutes'},
      {label: HOURS_TEXT, value: 'hours'},
      {label: DAYS_TEXT, value: 'days'}
    ]

    const numberPickerOptions = logoutNumberOptions.map((option) =>
      <Picker.Item label={option.label} value={option.value} key={option.label} />)

    const numberPicker = <Picker
      style={styles.autoLogoutPickerContainer}
      selectedValue={this.state.timeNumber}
      onValueChange={(timeNumber) => this.setState({timeNumber})}>
      {numberPickerOptions}
    </Picker>

    const measurementPickerOptions = logoutPeriodOptions.map((period) =>
      <Picker.Item label={period.label} value={period.value} key={period.label} />
    )

    const measurementPicker = <Picker
      style={styles.autoLogoutPickerContainer}
      selectedValue={this.state.timeMeasurement}
      onValueChange={(measurement) => this.setState({timeMeasurement: measurement})}
    >
      {measurementPickerOptions}
    </Picker>

    const modalMiddle = <View style={{flexDirection: 'row'}}>
      {numberPicker}
      {measurementPicker}
    </View>

    const modalBottom = <ModalButtons
      onDone={() => this.onDone(this.state.timeMeasurement, this.state.timeNumber)}
      onCancel={this.onCancel} />

    const icon = <IonIcon name='ios-time-outline' size={24}
      style={styles.icon} />

    return <StylizedModal
      visibilityBoolean={this.state.showModal}
      featuredIcon={icon}
      headerText={s.strings.dialog_title}
      modalMiddle={modalMiddle}
      modalBottom={modalBottom}
      onExitButtonFxn={this.onCancel}
    />
  }
}
