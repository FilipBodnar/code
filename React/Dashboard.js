import React, { Component } from "react"
import moment from "moment"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import * as api from "utils/api"
import ReactModal from "react-modal"

import { putEvents, filterEvents } from "redux/modules/events"

import { EventFilters, EventList } from "components/sections/dashboard"
import { CreateEventForm } from "containers/forms/event"
import { Button, Spinner, Title } from "components/misc"

import style from "./dashboard.styl"

class Dashboard extends Component {
  constructor() {
    super()
    
    this.state = {
      showModal: false,
      isLoading: false,
      isListView: false,
      user: {},
    }
  }

  handleOpenModal = () => {
    this.setState({ showModal: true })
  }

  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  static propTypes = {
    putEvents: PropTypes.func.isRequired,
    user: PropTypes.object,
    token: PropTypes.string,
  }

  componentWillMount() {
    this.handleGetEvents()
  }

  handleGetEvents = () => {
    const { token } = this.props

    api.getEvents(token).then(({ data }) => {
      this.props.putEvents(data) // Disaptch action putEvents

      this.setState({ isLoading: false })
    })
  }

  toggleListView = () => { // Handle dashboard layout change 
    this.setState({ isListView: !this.state.isListView })
  }

  render() {
    const { isLoading, isListView } = this.state
    const { events, filter, token, user } = this.props
    
    let filteredEvents = []

    switch (filter) {
      case "future":
        events.forEach(event => {
          const { startsAt } = event

          if (moment(event).isBefore(moment(startsAt))) {
            filteredEvents.push(event)
          }
        })
        break

      case "past":
        events.forEach(event => {
          const { startsAt } = event

          if (moment(event).isAfter(moment(startsAt))) {
            filteredEvents.push(event)
          }
        })
        break

      default:
        filteredEvents = events
    }

    return (
      <div className={style.dashboard}>
        <EventFilters
          handleFilterEvents={this.props.filterEvents}
          isListView={isListView}
          handleToggleView={this.toggleListView}
        />
        {isLoading ? (
          <Spinner />
        ) : (
          <EventList
            isListView={isListView}
            isLoading={isLoading}
            events={filteredEvents}
            user={user}
          />
        )}

        <Button round create onClick={this.handleOpenModal}>
          <span className={style.cross} />
        </Button>

        <ReactModal
          isOpen={this.state.showModal}
          className={style.content}
        >
          <div className={style.modal}>
            <div className={style.closeModal} onClick={this.handleCloseModal}>
              <img src={require("assets/img/icon-close.svg")} alt="close" />
              <Title content="Close" />
            </div>
            <CreateEventForm token={token} />
          </div>
        </ReactModal>
      </div>
    );
  }
}

const stateToProps = ({ events, auth }) => ({
  events: events.list,
  filter: events.filter,
  isListView: events.isListView,
  token: auth.token,
  user: auth.user,
})

const dispatchToProps = { putEvents, filterEvents };

export default connect(
  stateToProps,
  dispatchToProps,
)(Dashboard)
