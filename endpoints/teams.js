'use strict';

/**
 * Team API endpoint.
 *
 * @constructor
 * @param {Mana} api The actual API instance.
 * @api private
 */
function Team(api) {
  this.send = api.send.bind(api);
  this.options = api.options;
  this.api = api;
}

/**
 * List all active teams for a given repository.
 *
 * @param {String} project The project information.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Team.prototype.list = function list(args) {
  args = this.api.args(arguments);
  args.options = this.options(args.options);

  var project = this.api.project(args.str);

  return this.send(
    ['orgs', project.user, 'teams'],
    args.options,
    args.fn
  );
};

/**
 * Get Team information for a given id.
 *
 * @param {Number} id The team id.
 * @param {Object} options Optional options.
 * @param {function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Team.prototype.get = function get(args) {
  args = this.api.args(arguments);
  args.options = this.options(args.options);

  return this.send(
    ['teams', args.number],
    args.options,
    args.fn
  );
};

/**
 * Little syntax sugar for working with the teams API. It has no nice way of
 * just listing a team by name. It's not like someone is going to memorize the
 * id of a given team.. This function does a double lookup to get all teams,
 * filter by name and return all members of that team.
 *
 * @param {String} project <user>/<team> string.
 * @param {Object} options Optional options.
 * @param {Function} fn The callback.
 * @returns {Assign}
 * @api public
 */
Team.prototype.members = function members(args) {
  args = this.api.args(arguments);
  args.options = this.options(args.options);

  var project = this.api.project(args.str)
    , self = this;

  return this.list(project.user, function listed(err, teams) {
    if (err) return args.fn(err);

    var id;

    teams.some(function some(team) {
      if (team.name === project.repo) id = team.id;

      return typeof id === 'number';
    });

    self.send(
      ['teams', id, 'members'],
      args.options,
      args.fn
    );
  });
};

//
// Expose the Team API.
//
module.exports = Team;
